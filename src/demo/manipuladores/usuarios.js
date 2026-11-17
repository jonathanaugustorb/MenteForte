import { http, HttpResponse } from "msw";
import { rota } from "../apoio/rota";
import { conflito, erroDeRegra, naoEncontrado } from "../apoio/erros";
import { encerrarSessoesDe, exigirPapel, usuarioAutenticado } from "../apoio/acesso";
import { registrarAuditoria } from "../apoio/auditoria";
import { mascararEmail } from "../apoio/mascaras";
import { paginar } from "../apoio/paginacao";
import { protegerSenha, senhaConfere } from "../apoio/senha";
import { agora } from "../apoio/tempo";
import { PAPEIS } from "../apoio/opcoes";
import {
  cabe,
  criarValidacao,
  ehEmail,
  MENSAGEM_SEM_MARCACAO,
  normalizarEmail,
  preenchido,
  semMarcacao,
} from "../apoio/validacao";

const SENHA_MINIMA = 6;
const SENHA_MAXIMA = 64;
const JUSTIFICATIVA_MINIMA = 10;
const JUSTIFICATIVA_MAXIMA = 255;
const TAMANHO_PADRAO_DA_PAGINA = 20;
const MENSAGEM_ADMIN_NAO_EXCLUI =
  "Conta de administrador não pode ser excluída: a plataforma ficaria sem quem atende os pedidos de exclusão das outras pessoas";

function paraDetalhe(usuario) {
  return {
    id: usuario.id,
    nomeCompleto: usuario.nomeCompleto,
    email: usuario.email,
    papel: usuario.papel,
    ativo: usuario.ativo,
    criadoEm: usuario.criadoEm,
    anonimizacaoSolicitadaEm: usuario.anonimizacaoSolicitadaEm,
    anonimizadoEm: usuario.anonimizadoEm,
  };
}

function paraDetalheMascarado(usuario) {
  return { ...paraDetalhe(usuario), email: mascararEmail(usuario.email) };
}

function buscarUsuario(banco, id) {
  const usuario = banco.usuarios.find((candidato) => candidato.id === id);
  if (!usuario) throw naoEncontrado("Usuário não encontrado");
  return usuario;
}

function emailEmUso(banco, email, excetoId) {
  return banco.usuarios.some((usuario) => usuario.email === email && usuario.id !== excetoId);
}

function validarNome(validacao, nomeCompleto) {
  return validacao
    .exigir(preenchido(nomeCompleto), "nomeCompleto", "Informe o nome completo")
    .exigir(cabe(nomeCompleto, 150), "nomeCompleto", "O nome deve ter no máximo 150 caracteres")
    .exigir(semMarcacao(nomeCompleto), "nomeCompleto", MENSAGEM_SEM_MARCACAO);
}

function validarEmail(validacao, email, campo = "email") {
  return validacao
    .exigir(ehEmail(email), campo, "Informe um e-mail válido")
    .exigir(cabe(email, 255), campo, "O e-mail deve ter no máximo 255 caracteres");
}

function validarSenha(validacao, senha, campo = "senha") {
  const tamanho = typeof senha === "string" ? senha.length : 0;
  return validacao.exigir(
    tamanho >= SENHA_MINIMA && tamanho <= SENHA_MAXIMA,
    campo,
    `A senha deve ter de ${SENHA_MINIMA} a ${SENHA_MAXIMA} caracteres`,
  );
}

function exigirNaoAnonimizada(usuario) {
  if (usuario.anonimizadoEm) {
    throw erroDeRegra("Conta anonimizada não pode ser editada: os dados pessoais foram apagados");
  }
}

async function exigirSenhaAtual(banco, usuario, senhaAtual) {
  if (typeof senhaAtual === "string" && (await senhaConfere(senhaAtual, usuario))) return;
  registrarAuditoria(banco, {
    acao: "SENHA_FALHOU",
    recursoTipo: "USUARIO",
    recursoId: usuario.id,
    usuarioId: usuario.id,
  });
  throw erroDeRegra("A senha atual não confere");
}

function registrarAtualizacao(banco, usuarioAfetado, autor) {
  registrarAuditoria(banco, {
    acao: "ATUALIZADO",
    recursoTipo: "USUARIO",
    recursoId: usuarioAfetado.id,
    usuarioId: autor.id,
  });
}

function filtrarUsuarios(usuarios, consulta) {
  const termo = consulta.get("busca")?.trim().toLowerCase();
  const papel = consulta.get("papel");
  const ativo = consulta.get("ativo");

  return usuarios
    .filter((usuario) => !termo || `${usuario.nomeCompleto} ${usuario.email}`.toLowerCase().includes(termo))
    .filter((usuario) => !papel || usuario.papel === papel)
    .filter((usuario) => !ativo || String(usuario.ativo) === ativo)
    .sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto, "pt-BR"));
}

export const manipuladoresDeUsuarios = [
  http.post(
    "/api/usuarios",
    rota(async ({ corpo, banco }) => {
      const validacao = criarValidacao();
      validarNome(validacao, corpo.nomeCompleto);
      validarEmail(validacao, corpo.email);
      validarSenha(validacao, corpo.senha);
      validacao
        .exigir(Object.hasOwn(PAPEIS, corpo.papel ?? ""), "papel", "Escolha o perfil da conta")
        .exigir(corpo.aceitouTermosUso === true, "aceitouTermosUso", "É necessário aceitar os Termos de Uso")
        .exigir(
          corpo.aceitouPoliticaPrivacidade === true,
          "aceitouPoliticaPrivacidade",
          "É necessário aceitar a Política de Privacidade",
        )
        .concluir();

      const email = normalizarEmail(corpo.email);
      if (emailEmUso(banco, email)) {
        throw conflito(
          "Não foi possível concluir o cadastro com estes dados. Se você já tem conta, entre pelo botão Entrar.",
        );
      }

      const usuario = {
        id: crypto.randomUUID(),
        nomeCompleto: corpo.nomeCompleto.trim(),
        email,
        papel: corpo.papel,
        ...(await protegerSenha(corpo.senha)),
        ativo: true,
        criadoEm: agora(),
        versaoTermosUso: corpo.versaoTermosUso ?? null,
        versaoPoliticaPrivacidade: corpo.versaoPoliticaPrivacidade ?? null,
        anonimizacaoSolicitadaEm: null,
        anonimizadoEm: null,
      };
      banco.usuarios.push(usuario);
      registrarAuditoria(banco, { acao: "CRIADO", recursoTipo: "USUARIO", recursoId: usuario.id });

      return HttpResponse.json(paraDetalhe(usuario), { status: 201 });
    }),
  ),

  http.get(
    "/api/usuarios/me",
    rota(({ request, banco }) => paraDetalhe(usuarioAutenticado(request, banco))),
  ),

  http.put(
    "/api/usuarios/me",
    rota(({ request, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirNaoAnonimizada(usuario);
      const validacao = criarValidacao();
      validarNome(validacao, corpo.nomeCompleto);
      validacao.concluir();

      usuario.nomeCompleto = corpo.nomeCompleto.trim();
      registrarAtualizacao(banco, usuario, usuario);
      return paraDetalhe(usuario);
    }),
  ),

  http.post(
    "/api/usuarios/me/email",
    rota(async ({ request, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirNaoAnonimizada(usuario);
      const validacao = criarValidacao();
      validarEmail(validacao, corpo.novoEmail, "novoEmail");
      validacao.exigir(preenchido(corpo.senhaAtual), "senhaAtual", "Informe a senha atual").concluir();
      await exigirSenhaAtual(banco, usuario, corpo.senhaAtual);

      const novoEmail = normalizarEmail(corpo.novoEmail);
      if (novoEmail === usuario.email) throw erroDeRegra("O e-mail novo é igual ao atual");
      if (emailEmUso(banco, novoEmail, usuario.id)) throw conflito("Já existe uma conta com este e-mail");

      usuario.email = novoEmail;
      registrarAtualizacao(banco, usuario, usuario);
      return paraDetalhe(usuario);
    }),
  ),

  http.patch(
    "/api/usuarios/me/senha",
    rota(async ({ request, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirNaoAnonimizada(usuario);
      const validacao = criarValidacao();
      validacao.exigir(preenchido(corpo.senhaAtual), "senhaAtual", "Informe a senha atual");
      validarSenha(validacao, corpo.novaSenha, "novaSenha");
      validacao.concluir();
      await exigirSenhaAtual(banco, usuario, corpo.senhaAtual);

      Object.assign(usuario, await protegerSenha(corpo.novaSenha));
      registrarAtualizacao(banco, usuario, usuario);
    }),
  ),

  http.post(
    "/api/usuarios/me/anonimizacao",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      if (usuario.anonimizadoEm) throw conflito("Esta conta já foi anonimizada");
      if (usuario.papel === "ADMINISTRADOR") throw erroDeRegra(MENSAGEM_ADMIN_NAO_EXCLUI);
      if (usuario.anonimizacaoSolicitadaEm) return;

      usuario.anonimizacaoSolicitadaEm = agora();
      registrarAtualizacao(banco, usuario, usuario);
    }),
  ),

  http.delete(
    "/api/usuarios/me/anonimizacao",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      if (usuario.anonimizadoEm) throw conflito("Esta conta já foi anonimizada");
      if (!usuario.anonimizacaoSolicitadaEm) throw erroDeRegra("Não existe pedido de exclusão para cancelar");

      usuario.anonimizacaoSolicitadaEm = null;
      registrarAtualizacao(banco, usuario, usuario);
    }),
  ),

  http.get(
    "/api/usuarios/anonimizacoes-pendentes",
    rota(({ request, banco }) => {
      exigirPapel(usuarioAutenticado(request, banco), "ADMINISTRADOR");
      return banco.usuarios
        .filter((usuario) => usuario.anonimizacaoSolicitadaEm && !usuario.anonimizadoEm)
        .sort((a, b) => a.anonimizacaoSolicitadaEm.localeCompare(b.anonimizacaoSolicitadaEm))
        .map((usuario) => ({
          id: usuario.id,
          nomeCompleto: usuario.nomeCompleto,
          email: mascararEmail(usuario.email),
          papel: usuario.papel,
          solicitadaEm: usuario.anonimizacaoSolicitadaEm,
        }));
    }),
  ),

  http.get(
    "/api/usuarios",
    rota(({ request, consulta, banco }) => {
      const administrador = usuarioAutenticado(request, banco);
      exigirPapel(administrador, "ADMINISTRADOR");
      registrarAuditoria(banco, { acao: "LIDO", recursoTipo: "USUARIO", usuarioId: administrador.id });

      const pagina = paginar(filtrarUsuarios(banco.usuarios, consulta), consulta, TAMANHO_PADRAO_DA_PAGINA);
      return { ...pagina, conteudo: pagina.conteudo.map(paraDetalheMascarado) };
    }),
  ),

  http.get(
    "/api/usuarios/:id/dados-completos",
    rota(({ request, params, consulta, banco }) => {
      const administrador = usuarioAutenticado(request, banco);
      exigirPapel(administrador, "ADMINISTRADOR");
      const justificativa = consulta.get("justificativa")?.trim() ?? "";
      criarValidacao()
        .exigir(
          justificativa.length >= JUSTIFICATIVA_MINIMA && justificativa.length <= JUSTIFICATIVA_MAXIMA,
          "justificativa",
          `A justificativa deve ter de ${JUSTIFICATIVA_MINIMA} a ${JUSTIFICATIVA_MAXIMA} caracteres`,
        )
        .concluir();

      const usuario = buscarUsuario(banco, params.id);
      registrarAuditoria(banco, {
        acao: "DADO_COMPLETO_LIDO",
        recursoTipo: "USUARIO",
        recursoId: usuario.id,
        usuarioId: administrador.id,
        justificativa,
      });
      return paraDetalhe(usuario);
    }),
  ),

  http.put(
    "/api/usuarios/:id",
    rota(({ request, params, corpo, banco }) => {
      const administrador = usuarioAutenticado(request, banco);
      exigirPapel(administrador, "ADMINISTRADOR");
      const usuario = buscarUsuario(banco, params.id);
      exigirNaoAnonimizada(usuario);

      const validacao = criarValidacao();
      validarNome(validacao, corpo.nomeCompleto);
      validacao.exigir(
        !String(corpo.email ?? "").includes("***"),
        "email",
        "Não salve o e-mail mascarado: abra os dados completos da conta antes de editar",
      );
      validarEmail(validacao, corpo.email);
      validacao.concluir();

      const email = normalizarEmail(corpo.email);
      if (emailEmUso(banco, email, usuario.id)) throw conflito("Já existe uma conta com este e-mail");

      usuario.nomeCompleto = corpo.nomeCompleto.trim();
      usuario.email = email;
      registrarAtualizacao(banco, usuario, administrador);
      return paraDetalheMascarado(usuario);
    }),
  ),

  http.patch(
    "/api/usuarios/:id/ativo",
    rota(({ request, params, corpo, banco }) => {
      const administrador = usuarioAutenticado(request, banco);
      exigirPapel(administrador, "ADMINISTRADOR");
      criarValidacao().exigir(typeof corpo.ativo === "boolean", "ativo", "Informe se a conta fica ativa").concluir();
      if (!corpo.ativo && params.id === administrador.id) {
        throw erroDeRegra("Você não pode inativar a própria conta");
      }

      const usuario = buscarUsuario(banco, params.id);
      if (usuario.anonimizadoEm) {
        throw erroDeRegra("Conta anonimizada não volta a ficar ativa: a anonimização é irreversível");
      }

      usuario.ativo = corpo.ativo;
      if (!corpo.ativo) encerrarSessoesDe(banco, usuario.id);
      registrarAtualizacao(banco, usuario, administrador);
      return paraDetalheMascarado(usuario);
    }),
  ),

  http.post(
    "/api/usuarios/:id/anonimizar",
    rota(async ({ request, params, banco }) => {
      const administrador = usuarioAutenticado(request, banco);
      exigirPapel(administrador, "ADMINISTRADOR");
      const usuario = buscarUsuario(banco, params.id);
      if (usuario.anonimizadoEm) throw conflito("Esta conta já foi anonimizada");
      if (usuario.papel === "ADMINISTRADOR") throw erroDeRegra(MENSAGEM_ADMIN_NAO_EXCLUI);
      if (!usuario.anonimizacaoSolicitadaEm) throw erroDeRegra("Este usuário não pediu a exclusão da conta");

      Object.assign(usuario, await protegerSenha(crypto.randomUUID()), {
        nomeCompleto: "Usuário anonimizado",
        email: `anonimizado-${usuario.id}@menteforte.invalid`,
        ativo: false,
        anonimizadoEm: agora(),
      });
      banco.tentativas = banco.tentativas.filter((tentativa) => tentativa.usuarioId !== usuario.id);
      encerrarSessoesDe(banco, usuario.id);
      registrarAuditoria(banco, {
        acao: "ANONIMIZADO",
        recursoTipo: "USUARIO",
        recursoId: usuario.id,
        usuarioId: administrador.id,
      });
    }),
  ),
];
