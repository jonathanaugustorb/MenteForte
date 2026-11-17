export function paginar(itens, consulta, tamanhoPadrao) {
  const pagina = Math.max(0, Number.parseInt(consulta.get("pagina") ?? "0", 10) || 0);
  const tamanho = Math.min(100, Math.max(1, Number.parseInt(consulta.get("tamanho") ?? "", 10) || tamanhoPadrao));

  return {
    conteudo: itens.slice(pagina * tamanho, pagina * tamanho + tamanho),
    pagina,
    tamanho,
    totalDeItens: itens.length,
    totalDePaginas: Math.ceil(itens.length / tamanho),
  };
}
