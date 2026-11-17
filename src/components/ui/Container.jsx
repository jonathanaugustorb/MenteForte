const LARGURAS = {
  estreita: "max-w-4xl",
  padrao: "max-w-6xl",
  larga: "max-w-7xl",
};

function Container({ como: Elemento = "div", largura = "padrao", className = "", children }) {
  return (
    <Elemento className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${LARGURAS[largura]} ${className}`}>
      {children}
    </Elemento>
  );
}

export default Container;
