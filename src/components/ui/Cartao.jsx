function Cartao({ como: Elemento = "div", className = "", children, ...outras }) {
  return (
    <Elemento
      className={`rounded-2xl border border-borda bg-superficie p-6 shadow-cartao ${className}`}
      {...outras}
    >
      {children}
    </Elemento>
  );
}

export default Cartao;
