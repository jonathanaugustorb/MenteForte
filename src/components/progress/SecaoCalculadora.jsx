function SecaoCalculadora({ numero, titulo, conceito, resultado, comoCalculamos, children }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10 lg:py-16">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex flex-col gap-4 lg:w-2/5">
          <span className="text-xs tracking-widest text-gray-300">
            {numero}. CALCULADORA
          </span>
          <h2 className="font-titulo font-bold text-2xl text-white lg:text-3xl">
            {titulo}
          </h2>
          <p className="text-gray-300 wrap-break-word">{conceito}</p>
          {resultado}
          {comoCalculamos}
        </div>

        <div className="lg:w-3/5">{children}</div>
      </div>

      <div className="w-full h-px bg-gray-500 mt-10 lg:mt-16"></div>
    </section>
  );
}

export default SecaoCalculadora;
