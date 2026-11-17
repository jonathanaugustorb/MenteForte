import { ClipboardCheck } from "lucide-react";
import { estiloDeChip } from "./ui/estiloDeChip";

function FiltroParaAprovar({ ativo, aoAlternar, quantidade }) {
  return (
    <div className="mb-4">
      <button
        type="button"
        aria-pressed={ativo}
        onClick={() => aoAlternar(!ativo)}
        className={estiloDeChip(ativo)}
      >
        <ClipboardCheck size={16} aria-hidden="true" />
        Só os que preciso aprovar
        <span className="rounded-full bg-black/20 px-1.5 text-xs font-semibold">{quantidade}</span>
      </button>
    </div>
  );
}

export default FiltroParaAprovar;
