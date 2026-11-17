import { LockKeyhole, LogIn } from "lucide-react";
import Botao from "../components/ui/Botao";

function AvisoLogin({ aoFazerLogin }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-marca-600/15 text-marca-400">
        <LockKeyhole size={28} aria-hidden="true" />
      </span>
      <h2 className="font-titulo text-xl font-bold text-texto">Acesso restrito</h2>
      <p className="text-texto-suave">Você precisa estar logado para acessar esta área.</p>
      <Botao onClick={aoFazerLogin} className="mt-3">
        <LogIn size={16} aria-hidden="true" />
        Fazer login
      </Botao>
    </div>
  );
}

export default AvisoLogin;
