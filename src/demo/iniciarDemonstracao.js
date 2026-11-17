import { prepararBanco } from "./banco";

const PREFIXO_DO_SITE = "menteforte:";

export async function iniciarDemonstracao() {
  await prepararBanco();
  const { redeSimulada } = await import("./rede");
  await redeSimulada.enable();
}

export function restaurarDemonstracao() {
  try {
    const chaves = [];
    for (let indice = 0; indice < localStorage.length; indice += 1) {
      const chave = localStorage.key(indice);
      if (chave?.startsWith(PREFIXO_DO_SITE)) chaves.push(chave);
    }
    chaves.forEach((chave) => localStorage.removeItem(chave));
  } finally {
    window.location.assign("/");
  }
}
