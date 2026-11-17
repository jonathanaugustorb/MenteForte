import { acessoNegado, naoAutenticado } from "./erros";

function tokenDaRequisicao(request) {
  const cabecalho = request.headers.get("Authorization") ?? "";
  return cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;
}

export function usuarioAutenticado(request, banco) {
  const token = tokenDaRequisicao(request);
  const usuarioId = token ? banco.sessoes[token] : null;
  const usuario = banco.usuarios.find((candidato) => candidato.id === usuarioId);

  if (!usuario || !usuario.ativo) throw naoAutenticado();
  return usuario;
}

export function usuarioOpcional(request, banco) {
  const token = tokenDaRequisicao(request);
  const usuarioId = token ? banco.sessoes[token] : null;
  return banco.usuarios.find((candidato) => candidato.id === usuarioId && candidato.ativo) ?? null;
}

export function exigirPapel(usuario, ...papeis) {
  if (!papeis.includes(usuario.papel)) throw acessoNegado();
}

export function abrirSessao(banco, usuarioId) {
  const token = crypto.randomUUID();
  banco.sessoes[token] = usuarioId;
  return token;
}

export function encerrarSessoesDe(banco, usuarioId) {
  Object.keys(banco.sessoes)
    .filter((token) => banco.sessoes[token] === usuarioId)
    .forEach((token) => delete banco.sessoes[token]);
}
