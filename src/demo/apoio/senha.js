function paraHexadecimal(bytes) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function gerarHashDeSenha(senha, sal) {
  const conteudo = new TextEncoder().encode(`${sal}:${senha}`);
  return paraHexadecimal(await crypto.subtle.digest("SHA-256", conteudo));
}

export async function protegerSenha(senha) {
  const sal = crypto.randomUUID();
  return { sal, senhaHash: await gerarHashDeSenha(senha, sal) };
}

export async function senhaConfere(senha, usuario) {
  return (await gerarHashDeSenha(senha, usuario.sal)) === usuario.senhaHash;
}
