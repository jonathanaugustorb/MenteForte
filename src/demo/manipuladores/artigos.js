import { http, HttpResponse } from "msw";
import { rota } from "../apoio/rota";
import { conflito, erroDeRegra, naoEncontrado } from "../apoio/erros";
import { exigirPapel, usuarioAutenticado } from "../apoio/acesso";
import { registrarAuditoria } from "../apoio/auditoria";
import { anoAtual, agora } from "../apoio/tempo";
import { CATEGORIAS, listarOpcoes, opcao } from "../apoio/opcoes";
import { aparado, cabe, criarValidacao, MENSAGEM_SEM_MARCACAO, preenchido, semMarcacao } from "../apoio/validacao";
import {
  aprovarComoProfessor,
  camposDeModeracao,
  decidirSituacao,
  EDITORES,
  EM_ANALISE,
  exigirAutorOuAdministrador,
  exigirVagaDoProfessor,
  ordenarPorCriacao,
  podeVer,
  PUBLICADOS,
  removerAprovacoes,
  voltarParaAnalise,
} from "../apoio/moderacao";

const TIPO = "ARTIGO";
const FONTE_HTTPS = /^\s*https:\/\/[^\s@]+(\/\S*)?\s*$/;

function paraDTO(banco, artigo, usuario) {
  return {
    id: artigo.id,
    titulo: artigo.titulo,
    categoria: opcao(CATEGORIAS, artigo.categoria),
    resumo: artigo.resumo,
    fonte: artigo.fonte,
    autoria: artigo.autoria,
    tipoEstudo: artigo.tipoEstudo,
    ano: artigo.ano,
    ...camposDeModeracao(banco, TIPO, artigo, usuario),
  };
}

function buscarArtigo(banco, id) {
  const artigo = banco.artigos.find((candidato) => candidato.id === id);
  if (!artigo) throw naoEncontrado("Artigo não encontrado");
  return artigo;
}

function validarArtigo(corpo) {
  const ano = corpo.ano === "" || corpo.ano == null ? null : Number(corpo.ano);

  criarValidacao()
    .exigir(preenchido(corpo.titulo), "titulo", "Informe o título")
    .exigir(cabe(corpo.titulo, 255), "titulo", "O título deve ter no máximo 255 caracteres")
    .exigir(semMarcacao(corpo.titulo), "titulo", MENSAGEM_SEM_MARCACAO)
    .exigir(Object.hasOwn(CATEGORIAS, corpo.categoria ?? ""), "categoria", "Informe a categoria")
    .exigir(preenchido(corpo.resumo), "resumo", "Informe o resumo")
    .exigir(
      typeof corpo.resumo === "string" && corpo.resumo.length >= 250 && corpo.resumo.length <= 1000,
      "resumo",
      "O resumo deve ter de 250 a 1000 caracteres",
    )
    .exigir(semMarcacao(corpo.resumo), "resumo", MENSAGEM_SEM_MARCACAO)
    .exigir(preenchido(corpo.fonte), "fonte", "Informe a fonte")
    .exigir(cabe(corpo.fonte, 500), "fonte", "A fonte deve ter no máximo 500 caracteres")
    .exigir(
      FONTE_HTTPS.test(corpo.fonte ?? ""),
      "fonte",
      "A fonte deve ser um endereço https, sem usuário e senha no endereço",
    )
    .exigir(cabe(corpo.autoria, 255), "autoria", "A autoria deve ter no máximo 255 caracteres")
    .exigir(semMarcacao(corpo.autoria), "autoria", MENSAGEM_SEM_MARCACAO)
    .exigir(cabe(corpo.tipoEstudo, 100), "tipoEstudo", "O tipo de estudo deve ter no máximo 100 caracteres")
    .exigir(semMarcacao(corpo.tipoEstudo), "tipoEstudo", MENSAGEM_SEM_MARCACAO)
    .exigir(ano === null || (Number.isInteger(ano) && ano >= 1900), "ano", "O ano deve ser a partir de 1900")
    .concluir();

  if (ano !== null && ano > anoAtual()) {
    throw erroDeRegra(`O ano do estudo não pode ser futuro: o máximo é ${anoAtual()}`);
  }

  return {
    titulo: corpo.titulo.trim(),
    categoria: corpo.categoria,
    resumo: corpo.resumo.trim(),
    fonte: corpo.fonte.trim(),
    autoria: aparado(corpo.autoria),
    tipoEstudo: aparado(corpo.tipoEstudo),
    ano,
  };
}

function exigirFonteUnica(banco, fonte, excetoId) {
  if (banco.artigos.some((artigo) => artigo.fonte === fonte && artigo.id !== excetoId)) {
    throw conflito(`Já existe um artigo indicando esta fonte: ${fonte}`);
  }
}

function quizzesPublicadosQueIndicam(banco, artigoId) {
  return banco.quizzes.filter(
    (quiz) => PUBLICADOS.includes(quiz.status) && quiz.artigoIds.includes(artigoId),
  );
}

export const manipuladoresDeArtigos = [
  http.get(
    "/api/artigos/categorias",
    rota(() => listarOpcoes(CATEGORIAS)),
  ),

  http.get(
    "/api/artigos/pendentes",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "ADMINISTRADOR");
      const pendentes = banco.artigos.filter((artigo) => EM_ANALISE.includes(artigo.status));
      return ordenarPorCriacao(pendentes, true).map((artigo) => paraDTO(banco, artigo, usuario));
    }),
  ),

  http.get(
    "/api/artigos",
    rota(({ request, consulta, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      const status = consulta.get("status");
      const visiveis = banco.artigos
        .filter((artigo) => podeVer(artigo, usuario))
        .filter((artigo) => !status || artigo.status === status);
      return ordenarPorCriacao(visiveis).map((artigo) => paraDTO(banco, artigo, usuario));
    }),
  ),

  http.get(
    "/api/artigos/:id",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      const artigo = buscarArtigo(banco, params.id);
      if (!podeVer(artigo, usuario)) throw naoEncontrado("Artigo não encontrado");
      return paraDTO(banco, artigo, usuario);
    }),
  ),

  http.post(
    "/api/artigos",
    rota(({ request, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const dados = validarArtigo(corpo);
      exigirFonteUnica(banco, dados.fonte);
      exigirVagaDoProfessor(banco.artigos, usuario, "artigos");

      const artigo = {
        id: crypto.randomUUID(),
        ...dados,
        autorId: usuario.id,
        status: usuario.papel === "ADMINISTRADOR" ? "APROVADO" : "PENDENTE",
        motivoRejeicao: null,
        criadoEm: agora(),
        atualizadoEm: null,
      };
      banco.artigos.push(artigo);
      registrarAuditoria(banco, { acao: "CRIADO", recursoTipo: TIPO, recursoId: artigo.id, usuarioId: usuario.id });

      return HttpResponse.json(paraDTO(banco, artigo, usuario), { status: 201 });
    }),
  ),

  http.put(
    "/api/artigos/:id",
    rota(({ request, params, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const artigo = buscarArtigo(banco, params.id);
      exigirAutorOuAdministrador(artigo, usuario);
      const dados = validarArtigo(corpo);
      exigirFonteUnica(banco, dados.fonte, artigo.id);

      Object.assign(artigo, dados, { atualizadoEm: agora() });
      if (usuario.papel !== "ADMINISTRADOR") voltarParaAnalise(banco, TIPO, artigo);
      registrarAuditoria(banco, { acao: "ATUALIZADO", recursoTipo: TIPO, recursoId: artigo.id, usuarioId: usuario.id });

      return paraDTO(banco, artigo, usuario);
    }),
  ),

  http.delete(
    "/api/artigos/:id",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const artigo = buscarArtigo(banco, params.id);
      exigirAutorOuAdministrador(artigo, usuario);

      const [quiz] = quizzesPublicadosQueIndicam(banco, artigo.id);
      if (quiz) {
        throw conflito(
          `Este artigo é leitura sugerida do quiz "${quiz.titulo}". Troque a indicação no quiz antes de excluir.`,
        );
      }

      banco.artigos = banco.artigos.filter((candidato) => candidato.id !== artigo.id);
      banco.quizzes.forEach((candidato) => {
        candidato.artigoIds = candidato.artigoIds.filter((artigoId) => artigoId !== artigo.id);
      });
      removerAprovacoes(banco, TIPO, artigo.id);
      registrarAuditoria(banco, { acao: "EXCLUIDO", recursoTipo: TIPO, recursoId: artigo.id, usuarioId: usuario.id });
    }),
  ),

  http.post(
    "/api/artigos/:id/aprovacoes",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "PROFESSOR");
      const artigo = buscarArtigo(banco, params.id);
      aprovarComoProfessor(banco, TIPO, artigo, usuario, "um artigo");
      return paraDTO(banco, artigo, usuario);
    }),
  ),

  http.patch(
    "/api/artigos/:id/status",
    rota(({ request, params, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "ADMINISTRADOR");
      const artigo = buscarArtigo(banco, params.id);
      const rejeitado = decidirSituacao(banco, TIPO, artigo, corpo, usuario, "Este artigo já foi decidido");

      if (rejeitado) {
        quizzesPublicadosQueIndicam(banco, artigo.id).forEach((quiz) => {
          voltarParaAnalise(banco, "QUIZ", quiz);
          quiz.motivoRejeicao = `O artigo "${artigo.titulo}", indicado na leitura sugerida, foi rejeitado. Troque a indicação.`;
          registrarAuditoria(banco, { acao: "ATUALIZADO", recursoTipo: "QUIZ", recursoId: quiz.id, usuarioId: usuario.id });
        });
      }

      return paraDTO(banco, artigo, usuario);
    }),
  ),
];
