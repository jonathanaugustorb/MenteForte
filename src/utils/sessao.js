import { limparCachesConsumo } from "./cacheConsumoAgua";

const CHAVE_TOKEN = "menteforte:token";
const CHAVE_USUARIO = "menteforte:usuario";

export const CHAVES_DA_SESSAO = [CHAVE_TOKEN, CHAVE_USUARIO];
export const EVENTO_SESSAO_EXPIRADA = "menteforte:sessao-expirada";

export function lerToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export function lerSessao() {
  try {
    const bruto = localStorage.getItem(CHAVE_USUARIO);
    if (!bruto) return null;
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

export function gravarSessao({ id, token, nomeCompleto, papel }) {
  try {
    localStorage.setItem(CHAVE_TOKEN, token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify({ id, nomeCompleto, papel }));
    return true;
  } catch {
    return false;
  }
}

export function atualizarNomeDaSessao(nomeCompleto) {
  const sessao = lerSessao();
  if (!sessao) return false;
  try {
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify({ ...sessao, nomeCompleto }));
    return true;
  } catch {
    return false;
  }
}

export function limparSessao() {
  try {
    CHAVES_DA_SESSAO.forEach((chave) => localStorage.removeItem(chave));
  } finally {
    limparCachesConsumo();
  }
}

export function expirarSessao() {
  limparSessao();
  window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
}
