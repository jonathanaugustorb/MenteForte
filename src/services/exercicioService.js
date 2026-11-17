import api from "./api";
import { estaPublicado } from "../utils/moderacao";
import { lerSessao } from "../utils/sessao";
import { exigirVagaParaCriar } from "../utils/limiteCriacao";

export async function listarGruposMusculares() {
  const { data } = await api.get("/exercicios/grupos-musculares");
  return data;
}

export async function listarNiveis() {
  const { data } = await api.get("/exercicios/niveis");
  return data;
}

export async function listarExercicios() {
  const { data } = await api.get("/exercicios");
  return data;
}

export async function listarExerciciosPublicados() {
  const exercicios = await listarExercicios();
  return exercicios.filter(estaPublicado);
}

export async function criarExercicio(exercicio) {
  const usuario = lerSessao();
  if (usuario?.papel === "PROFESSOR") {
    exigirVagaParaCriar(await listarExercicios(), usuario);
  }
  const { data } = await api.post("/exercicios", exercicio);
  return data;
}

export async function atualizarExercicio(id, exercicio) {
  const { data } = await api.put(`/exercicios/${id}`, exercicio);
  return data;
}

export async function excluirExercicio(id) {
  await api.delete(`/exercicios/${id}`);
}

export async function aprovarExercicio(id) {
  const { data } = await api.post(`/exercicios/${id}/aprovacoes`);
  return data;
}

export async function alterarStatusExercicio(id, status, motivo) {
  const { data } = await api.patch(`/exercicios/${id}/status`, { status, motivo });
  return data;
}

export async function listarExerciciosPendentes() {
  const { data } = await api.get("/exercicios/pendentes");
  return data;
}
