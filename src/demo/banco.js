import { criarDadosIniciais } from "./dados/dadosIniciais";

const CHAVE = "menteforte:demo:banco";
const VERSAO = 1;

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const banco = JSON.parse(bruto);
    return banco?.versao === VERSAO ? banco : null;
  } catch {
    return null;
  }
}

export function lerBanco() {
  const banco = carregar();
  if (!banco) {
    throw new Error("Os dados da demonstração não foram preparados.");
  }
  return banco;
}

export function salvarBanco(banco) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(banco));
    return true;
  } catch {
    return false;
  }
}

export async function prepararBanco() {
  if (carregar()) return;
  const banco = await criarDadosIniciais();
  salvarBanco({ ...banco, versao: VERSAO });
}
