import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { rotuloDoPapel } from "../utils/papeis";

const ESTILO_ITEM =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-texto-suave hover:bg-white/5 hover:text-texto cursor-pointer";

function iniciais(nomeCompleto) {
  const partes = nomeCompleto.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes.at(-1)[0] : "";
  return `${primeira}${ultima}`.toUpperCase();
}

function primeiroEUltimoNome(nomeCompleto) {
  const partes = nomeCompleto.trim().split(/\s+/);
  return partes.length > 2 ? `${partes[0]} ${partes.at(-1)}` : nomeCompleto;
}

function MenuDaConta({ usuario, aoSair }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef(null);

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(evento) {
      if (!raiz.current?.contains(evento.target)) setAberto(false);
    }

    function aoTeclar(evento) {
      if (evento.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  function sair() {
    setAberto(false);
    aoSair();
  }

  return (
    <div ref={raiz} className="relative">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-da-conta"
        aria-label={`Conta de ${usuario.nomeCompleto}`}
        onClick={() => setAberto((atual) => !atual)}
        className="flex items-center gap-2 rounded-full border border-borda py-1 pr-2.5 pl-1 text-sm text-texto-suave hover:border-borda-forte hover:text-texto cursor-pointer"
      >
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-full bg-marca-600/20 text-xs font-bold text-marca-200"
        >
          {iniciais(usuario.nomeCompleto)}
        </span>
        <span aria-hidden="true" className="hidden max-w-36 truncate 2xl:inline">
          {primeiroEUltimoNome(usuario.nomeCompleto)}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <div
          id="menu-da-conta"
          className="absolute right-0 mt-2 w-64 animate-surgir overflow-hidden rounded-xl border border-borda bg-superficie-alta shadow-2xl shadow-black/50"
        >
          <div className="border-b border-borda px-4 py-3">
            <p className="truncate text-sm font-semibold text-texto">{usuario.nomeCompleto}</p>
            <p className="text-xs text-texto-fraco">{rotuloDoPapel(usuario.papel)}</p>
          </div>
          <div className="p-1.5">
            <Link to="/minha-conta" onClick={() => setAberto(false)} className={ESTILO_ITEM}>
              <UserRound size={16} aria-hidden="true" />
              Meus dados
            </Link>
            <button type="button" onClick={sair} className={ESTILO_ITEM}>
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuDaConta;
