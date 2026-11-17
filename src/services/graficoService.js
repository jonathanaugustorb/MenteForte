import api from "./api";

const DIAS_DE_ATIVIDADE = 7;

export async function listarMinhasTentativas() {
  const { data } = await api.get("/quizzes/minhas-tentativas");
  return data;
}

export async function listarDesempenhoDosMeusQuizzes() {
  const { data } = await api.get("/quizzes/meus/desempenho");
  return data;
}

export async function listarContasPorPapel() {
  const { data } = await api.get("/estatisticas/contas-por-papel");
  return data;
}

export async function listarAtividadePorDia() {
  const { data } = await api.get("/estatisticas/atividade-por-dia", {
    params: { dias: DIAS_DE_ATIVIDADE },
  });
  return data;
}
