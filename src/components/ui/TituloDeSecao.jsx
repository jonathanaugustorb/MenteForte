function TituloDeSecao({ id, sobretitulo, titulo, descricao, centralizado = false }) {
  return (
    <div className={`max-w-2xl ${centralizado ? "mx-auto text-center" : ""}`}>
      {sobretitulo && <p className="text-sm font-semibold text-marca-400">{sobretitulo}</p>}
      <h2 id={id} className="mt-2 font-titulo text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
        {titulo}
      </h2>
      {descricao && <p className="mt-4 text-lg leading-relaxed text-texto-suave">{descricao}</p>}
    </div>
  );
}

export default TituloDeSecao;
