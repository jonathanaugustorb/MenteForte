import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import ValidacaoArtigo from "../ArticlesComponents/ValidacaoArtigo";
import { estiloDeBotao } from "../ui/estiloDeBotao";


function ArtigoNaFila({ artigo, aoAlterarStatus }) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <p className="text-sm leading-relaxed text-texto-suave wrap-anywhere">{artigo.resumo}</p>

      <div className="flex flex-wrap gap-2">
        <Link to={`/articles/${artigo.id}`} className={estiloDeBotao({ variante: "secundario", tamanho: "pequeno" })}>
          Ver no site
        </Link>
        <a
          href={artigo.fonte}
          target="_blank"
          rel="noopener noreferrer"
          className={estiloDeBotao({ variante: "secundario", tamanho: "pequeno" })}
        >
          Abrir o original
          <ExternalLink size={14} aria-hidden="true" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>

      <ValidacaoArtigo
        artigo={artigo}
        aoAlterarStatus={aoAlterarStatus}
      />
    </div>
  );
}

export default ArtigoNaFila;