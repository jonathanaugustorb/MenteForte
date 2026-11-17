import { formatarNumero } from "../../utils/formatar";

function CardResultado({ rotulo, valor, unidade, rodape, variante, tamanho }) {
  const corValor = variante === "neutro" ? "text-white" : "text-marca-200";
  const tamanhoValor =
    tamanho === "medio" ? "text-3xl lg:text-4xl" : "text-5xl lg:text-6xl";

  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2 p-7 border bg-superficie border-borda rounded-xl shadow-cartao">
      <span className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">{rotulo}</span>

      <div className="flex items-end gap-2">
        <span
          className={`font-titulo font-bold ${tamanhoValor} ${corValor} break-all`}
        >
          {formatarNumero(valor)}
        </span>
        <span className="text-white text-sm pb-1 shrink-0">{unidade}</span>
      </div>

      {rodape ? (
        <>
          <div className="w-full h-px bg-borda"></div>
          <div className="text-texto-suave text-sm">{rodape}</div>
        </>
      ) : null}
    </div>
  );
}

export default CardResultado;
