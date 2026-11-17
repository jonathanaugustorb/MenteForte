function ComoCalculamos({ formulas, variaveis, arredondamento, seuCalculo }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-borda p-5">
      <span className="text-xs font-semibold tracking-wider text-marca-300 uppercase">
        Como calculamos
      </span>

      <ul className="flex flex-col gap-1">
        {formulas.map((formula) => (
          <li
            key={formula}
            className="text-sm font-semibold text-white wrap-break-word"
          >
            {formula}
          </li>
        ))}
      </ul>

      <ul className="flex flex-col gap-2 text-sm">
        {variaveis.map((variavel) => (
          <li key={variavel.simbolo} className="text-texto-suave wrap-break-word">
            <span className="font-semibold text-marca-200">
              {variavel.simbolo}:
            </span>{" "}
            {variavel.descricao}
          </li>
        ))}
      </ul>

      <p className="text-xs text-texto-suave">{arredondamento}</p>

      {seuCalculo ? (
        <div className="flex flex-col gap-1 border-t border-borda pt-4">
          <span className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
            Seu cálculo
          </span>
          {seuCalculo.map((linha) => (
            <p key={linha} className="text-sm text-white wrap-break-word">
              {linha}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ComoCalculamos;