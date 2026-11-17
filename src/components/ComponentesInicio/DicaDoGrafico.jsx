function DicaDoGrafico({ active, payload, sufixo = "" }) {
  if (!active || !payload?.length) return null;

  const { rotulo, valor, detalhe } = payload[0].payload;

  return (
    <div className="max-w-56 rounded-lg border border-borda-forte bg-superficie-alta px-3 py-2 shadow-2xl shadow-black/50">
      <p className="text-base font-bold text-texto">
        {valor}
        {sufixo}
      </p>
      <p className="text-xs text-texto-suave">{rotulo}</p>
      {detalhe && <p className="text-xs text-texto-fraco">{detalhe}</p>}
    </div>
  );
}

export default DicaDoGrafico;
