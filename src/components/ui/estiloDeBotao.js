const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-[background-color,border-color,color,box-shadow] duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50";

const VARIANTES = {
  primario: "bg-marca-600 text-white shadow-marca hover:bg-marca-500 active:bg-marca-700",
  secundario: "border border-borda-forte bg-superficie-alta text-texto hover:border-texto-fraco hover:bg-borda",
  contorno: "border border-marca-500/70 text-marca-100 hover:border-marca-500 hover:bg-marca-600 hover:text-white",
  fantasma: "text-texto-suave hover:bg-white/5 hover:text-texto",
  perigo: "border border-perigo/40 bg-perigo/10 text-perigo hover:bg-perigo hover:text-fundo",
};

const TAMANHOS = {
  pequeno: "h-9 px-3 text-sm",
  medio: "h-11 px-5 text-sm",
  grande: "h-12 px-7 text-base",
  icone: "size-10",
};

export function estiloDeBotao({
  variante = "primario",
  tamanho = "medio",
  larguraTotal = false,
  className = "",
} = {}) {
  return [BASE, VARIANTES[variante], TAMANHOS[tamanho], larguraTotal && "w-full", className]
    .filter(Boolean)
    .join(" ");
}
