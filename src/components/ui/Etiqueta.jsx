const TONS = {
  marca: "bg-marca-600/15 text-marca-300 ring-marca-500/30",
  neutra: "bg-white/5 text-texto-suave ring-white/10",
  sucesso: "bg-sucesso/10 text-sucesso ring-sucesso/30",
  aviso: "bg-aviso/10 text-aviso ring-aviso/30",
  perigo: "bg-perigo/10 text-perigo ring-perigo/30",
};

function Etiqueta({ tom = "neutra", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONS[tom]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Etiqueta;
