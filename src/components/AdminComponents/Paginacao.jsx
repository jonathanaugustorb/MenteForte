import { estiloDeBotao } from "../ui/estiloDeBotao";

function Paginacao({ pagina, totalDePaginas, totalDeItens, aoMudarPagina }) {
  const primeira = pagina <= 0;
  const ultima = pagina >= totalDePaginas - 1;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-texto-fraco">
        {totalDeItens} registro{totalDeItens === 1 ? "" : "s"} · página{" "}
        {pagina + 1} de {totalDePaginas}
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={primeira}
          onClick={() => aoMudarPagina(pagina - 1)}
          className={estiloDeBotao({ variante: "secundario" })}
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={ultima}
          onClick={() => aoMudarPagina(pagina + 1)}
          className={estiloDeBotao({ variante: "secundario" })}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Paginacao;
