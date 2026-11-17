import { Link } from "react-router-dom";
import Etiqueta from "../ui/Etiqueta";
import { etiquetaDoArtigo } from "./artigoCampos";

function CardArtigo({ artigo }) {
  const { id, categoria, titulo, resumo, tipoEstudo, ano } = artigo;
  const etiquetaStatus = etiquetaDoArtigo(artigo);
  const detalhes = [tipoEstudo, ano].filter(Boolean).join(" · ");

  return (
    <Link
      to={`/articles/${id}`}
      className="group flex h-full flex-col rounded-2xl border border-borda bg-superficie p-6 shadow-cartao transition-colors hover:border-marca-500/60 focus-visible:border-marca-500"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Etiqueta tom="marca">{categoria.descricao}</Etiqueta>
        {etiquetaStatus && <Etiqueta>{etiquetaStatus}</Etiqueta>}
      </div>

      <h3 className="mt-4 font-titulo text-lg font-bold text-texto group-hover:text-marca-100">{titulo}</h3>
      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-texto-suave">{resumo}</p>

      {detalhes && (
        <div className="mt-auto pt-5">
          <p className="border-t border-borda pt-4 text-xs text-texto-fraco">{detalhes}</p>
        </div>
      )}
    </Link>
  );
}

export default CardArtigo;
