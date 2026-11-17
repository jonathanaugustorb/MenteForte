import { LoaderCircle } from "lucide-react";

function Carregando({ mensagem = "Carregando...", className = "" }) {
  return (
    <p role="status" className={`flex items-center gap-2 text-sm text-texto-suave ${className}`}>
      <LoaderCircle
        size={16}
        aria-hidden="true"
        className="shrink-0 animate-spin text-marca-400 motion-reduce:animate-none"
      />
      {mensagem}
    </p>
  );
}

export default Carregando;
