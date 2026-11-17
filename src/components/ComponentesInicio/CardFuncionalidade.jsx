import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import IconeDaPagina from "../ui/IconeDaPagina";

function CardFuncionalidade({ para, icone, titulo, texto }) {
  return (
    <Link
      to={para}
      className="group flex flex-col gap-4 rounded-2xl border border-borda bg-superficie p-6 shadow-cartao transition-[translate,border-color,box-shadow] duration-200 hover:border-marca-500/60 hover:shadow-marca focus-visible:border-marca-500 motion-safe:hover:-translate-y-1"
    >
      <IconeDaPagina icone={icone} />
      <h3 className="font-titulo text-lg font-bold text-texto">{titulo}</h3>
      <p className="flex-1 text-sm leading-relaxed text-texto-suave">{texto}</p>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-marca-300 group-hover:text-marca-200">
        Acessar
        <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default CardFuncionalidade;
