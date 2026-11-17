function SecaoCalculadora({ numero, titulo, conceito, resultado, comoCalculamos, children }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex flex-col gap-4 lg:w-2/5">
          <span className="text-sm font-semibold text-marca-400">Calculadora {numero}</span>
          <h2 className="font-titulo text-2xl font-extrabold tracking-tight text-texto lg:text-3xl">
            {titulo}
          </h2>
          <p className="text-texto-suave wrap-break-word">{conceito}</p>
          {resultado}
          {comoCalculamos}
        </div>

        <div className="lg:w-3/5">{children}</div>
      </div>

      <div className="w-full h-px bg-borda mt-10 lg:mt-16"></div>
    </section>
  );
}

export default SecaoCalculadora;
