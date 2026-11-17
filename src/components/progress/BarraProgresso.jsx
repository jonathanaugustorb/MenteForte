function BarraProgresso({ rotulo, percentual, mensagem }) {
  const largura = Math.min(Math.max(percentual ?? 0, 0), 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-4 text-sm">
        <span className="text-texto-suave">{rotulo}</span>
        <span className="text-marca-200">{percentual}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-superficie-alta">
        <div
          className="h-full rounded-full bg-marca-600"
          style={{ width: `${largura}%` }}
        ></div>
      </div>

      {mensagem ? (
        <p className="text-texto-suave wrap-break-word">{mensagem}</p>
      ) : null}
    </div>
  );
}

export default BarraProgresso;
