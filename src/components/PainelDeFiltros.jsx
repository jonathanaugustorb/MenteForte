import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

function PainelDeFiltros({ id, rotulo, resumo, children }) {
  const [aberto, setAberto] = useState(false);

  function fechar() {
    setAberto(false);
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((atual) => !atual)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-borda-forte bg-superficie px-3.5 py-2.5 text-sm text-texto-suave hover:text-texto cursor-pointer md:hidden"
      >
        <span className="flex items-center gap-2 font-medium">
          <SlidersHorizontal size={16} aria-hidden="true" />
          {rotulo}
        </span>
        <span className="flex items-center gap-1.5 text-texto-fraco">
          {resumo}
          <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${aberto ? "rotate-180" : ""}`} />
        </span>
      </button>

      <div id={id} className={`${aberto ? "flex" : "hidden"} mt-3 flex-col gap-3 md:mt-0 md:flex`}>
        {typeof children === "function" ? children({ fechar }) : children}
      </div>
    </div>
  );
}

export default PainelDeFiltros;
