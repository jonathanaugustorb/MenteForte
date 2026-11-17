import IconeDaPagina from "./IconeDaPagina";

function CabecalhoPagina({ titulo, subtitulo, icone, children }) {
  return (
    <header className="mb-10 border-b border-borda pt-10 pb-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          {icone && <IconeDaPagina icone={icone} />}
          <div className="max-w-2xl">
            <h1 className="font-titulo text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
              {titulo}
            </h1>
            {subtitulo && <p className="mt-2 text-base text-texto-suave">{subtitulo}</p>}
          </div>
        </div>
        {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}

export default CabecalhoPagina;
