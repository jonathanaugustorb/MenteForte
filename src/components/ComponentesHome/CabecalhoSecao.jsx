function CabecalhoSecao({ rotulo, titulo, descricao, nivel = 1 }) {
  const Titulo = `h${nivel}`;

  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
          {rotulo}
        </p>
        <Titulo className="mt-1 font-titulo font-bold text-3xl text-white sm:text-4xl">
          {titulo}
        </Titulo>
      </div>

      {descricao && (
        <p className="text-sm text-gray-400 sm:max-w-sm sm:text-right">
          {descricao}
        </p>
      )}
    </div>
  );
}

export default CabecalhoSecao;
