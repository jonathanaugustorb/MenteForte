function BlocoExplicacao({ texto }) {
  if (!texto) return null;

  return (
    <div className="flex flex-col gap-2 border-l-2 border-marca-500 pl-4">
      <span className="text-xs font-semibold tracking-wider text-marca-300 uppercase">
        Entenda o cálculo
      </span>
      <p className="text-texto-suave wrap-break-word">{texto}</p>
    </div>
  );
}

export default BlocoExplicacao;
