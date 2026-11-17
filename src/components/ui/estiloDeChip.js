export const ESTILO_CHIP =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export const ESTILO_CHIP_ATIVO = "border-marca-500 bg-marca-600 text-white";

export const ESTILO_CHIP_INATIVO =
  "border-borda-forte text-texto-suave hover:border-texto-fraco hover:text-texto";

export function estiloDeChip(ativo) {
  return `${ESTILO_CHIP} ${ativo ? ESTILO_CHIP_ATIVO : ESTILO_CHIP_INATIVO}`;
}
