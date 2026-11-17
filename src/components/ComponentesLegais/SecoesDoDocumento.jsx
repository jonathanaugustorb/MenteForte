function SecoesDoDocumento({ secoes }) {
  return (
    <div className="space-y-8">
      {secoes.map((secao) => (
        <section key={secao.titulo} className="space-y-3">
          <h2 className="font-titulo text-lg font-bold text-texto sm:text-xl">{secao.titulo}</h2>
          {secao.paragrafos?.map((paragrafo) => (
            <p key={paragrafo} className="leading-relaxed text-texto-suave">
              {paragrafo}
            </p>
          ))}
          {secao.lista && (
            <ul className="list-disc space-y-1 pl-6 leading-relaxed text-texto-suave marker:text-marca-400">
              {secao.lista.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

export default SecoesDoDocumento;
