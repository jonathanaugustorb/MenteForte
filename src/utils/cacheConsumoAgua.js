const PREFIXO = "menteforte:consumo-agua:";

function chaveDoUsuario(usuarioId) {
  return `${PREFIXO}${usuarioId}`;
}

export function dataDeHoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function lerCacheConsumo(usuarioId, data) {
  if (!usuarioId) return null;
  try {
    const bruto = localStorage.getItem(chaveDoUsuario(usuarioId));
    if (!bruto) return null;

    const cache = JSON.parse(bruto);
    return cache.data === data ? cache.resumo : null;
  } catch {
    return null;
  }
}

export function gravarCacheConsumo(usuarioId, data, resumo) {
  if (!usuarioId) return false;
  try {
    localStorage.setItem(chaveDoUsuario(usuarioId), JSON.stringify({ data, resumo }));
    return true;
  } catch {
    return false;
  }
}

export function limparCachesConsumo() {
  try {
    const chaves = [];
    for (let indice = 0; indice < localStorage.length; indice += 1) {
      const chave = localStorage.key(indice);
      if (chave?.startsWith(PREFIXO)) chaves.push(chave);
    }
    chaves.forEach((chave) => localStorage.removeItem(chave));
    return true;
  } catch {
    return false;
  }
}
