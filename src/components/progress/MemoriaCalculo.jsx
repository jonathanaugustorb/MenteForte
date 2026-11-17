function MemoriaCalculo({ itens }) {
  if (!itens || !itens.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
        Memória de cálculo
      </span>

      <ul className="flex flex-col">
        {itens.map((item) => (
          <li
            key={item.rotulo}
            className="flex justify-between gap-4 border-b border-borda py-2 text-sm"
          >
            <span className="text-texto-suave">{item.rotulo}</span>
            <span className="text-marca-200">{item.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemoriaCalculo;
