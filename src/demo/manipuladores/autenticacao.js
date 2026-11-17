import { http } from "msw";
import { rota } from "../apoio/rota";
import { naoAutenticado } from "../apoio/erros";
import { abrirSessao } from "../apoio/acesso";
import { registrarAuditoria } from "../apoio/auditoria";
import { senhaConfere } from "../apoio/senha";
import { criarValidacao, normalizarEmail, preenchido } from "../apoio/validacao";

const MENSAGEM_LOGIN_INVALIDO = "E-mail ou senha inválidos.";

export const manipuladoresDeAutenticacao = [
  http.post(
    "/api/auth/login",
    rota(async ({ corpo, banco }) => {
      criarValidacao()
        .exigir(preenchido(corpo.email), "email", "Informe o e-mail")
        .exigir(preenchido(corpo.senha), "senha", "Informe a senha")
        .concluir();

      const usuario = banco.usuarios.find((candidato) => candidato.email === normalizarEmail(corpo.email));
      const valido = usuario?.ativo && (await senhaConfere(corpo.senha, usuario));

      if (!valido) {
        registrarAuditoria(banco, {
          acao: "LOGIN_FALHOU",
          recursoTipo: "USUARIO",
          recursoId: usuario?.id ?? null,
          usuarioId: usuario?.id ?? null,
        });
        throw naoAutenticado(MENSAGEM_LOGIN_INVALIDO);
      }

      const token = abrirSessao(banco, usuario.id);
      registrarAuditoria(banco, {
        acao: "LOGIN_REALIZADO",
        recursoTipo: "USUARIO",
        recursoId: usuario.id,
        usuarioId: usuario.id,
      });

      return { id: usuario.id, token, nomeCompleto: usuario.nomeCompleto, papel: usuario.papel };
    }),
  ),
];
