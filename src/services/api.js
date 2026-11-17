import axios from "axios";
import { expirarSessao, lerToken } from "../utils/sessao";

const MENSAGEM_PADRAO = "Não foi possível concluir a operação. Tente novamente.";

function ehRotaDeAutenticacao(config) {
  return (config?.url ?? "").startsWith("/auth/");
}

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (ehRotaDeAutenticacao(config)) {
    return config;
  }

  const token = lerToken();
  config.tokenDaSessao = token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const sessaoAindaAtual = error.config?.tokenDaSessao === lerToken();

    if (status === 401 && !ehRotaDeAutenticacao(error.config) && sessaoAindaAtual) {
      expirarSessao();
    }

    return Promise.reject({
      status,
      mensagem: error.response?.data?.message || MENSAGEM_PADRAO,
      campos: error.response?.data?.campos ?? [],
      original: error,
    });
  },
);

export default api;
