import api from "./api";
import { limparParametros } from "./parametros";

export async function criarUsuario(usuario) {
  const { data } = await api.post("/usuarios", usuario);
  return data;
}

export async function buscarUsuarios(parametros) {
  const { data } = await api.get("/usuarios", { params: limparParametros(parametros) });
  return data;
}

export async function buscarDadosCompletos(id, justificativa) {
  const { data } = await api.get(`/usuarios/${id}/dados-completos`, { params: { justificativa } });
  return data;
}

export async function atualizarUsuario(id, dados) {
  const { data } = await api.put(`/usuarios/${id}`, dados);
  return data;
}

export async function alterarAtivo(id, ativo) {
  const { data } = await api.patch(`/usuarios/${id}/ativo`, { ativo });
  return data;
}

export async function anonimizarUsuario(id) {
  await api.post(`/usuarios/${id}/anonimizar`);
}

export async function listarAnonimizacoesPendentes() {
  const { data } = await api.get("/usuarios/anonimizacoes-pendentes");
  return data;
}

export async function buscarMinhaConta() {
  const { data } = await api.get("/usuarios/me");
  return data;
}

export async function atualizarMinhaConta(dados) {
  const { data } = await api.put("/usuarios/me", dados);
  return data;
}

export async function trocarMeuEmail(novoEmail, senhaAtual) {
  const { data } = await api.post("/usuarios/me/email", { novoEmail, senhaAtual });
  return data;
}

export async function alterarMinhaSenha(senhaAtual, novaSenha) {
  await api.patch("/usuarios/me/senha", { senhaAtual, novaSenha });
}

export async function solicitarExclusaoDaMinhaConta() {
  await api.post("/usuarios/me/anonimizacao");
}

export async function cancelarExclusaoDaMinhaConta() {
  await api.delete("/usuarios/me/anonimizacao");
}
