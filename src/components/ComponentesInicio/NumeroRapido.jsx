function NumeroRapido({ rotulo, valor, detalhe }) {
  return (
    <div className="rounded-2xl border border-borda bg-superficie p-5 shadow-cartao">
      <p className="text-sm font-medium text-texto-suave">{rotulo}</p>
      <p className="mt-2 font-titulo text-4xl font-extrabold tracking-tight text-texto">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-texto-fraco">{detalhe}</p>}
    </div>
  );
}

export default NumeroRapido;
