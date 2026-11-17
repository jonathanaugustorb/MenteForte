import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ESTILO_ENTRADA } from "./estiloDeCampo";
import { LIMITE_SENHA } from "../../utils/limites";

function CampoSenha({ id, name, valor, aoAlterar, autoComplete, className = ESTILO_ENTRADA, ...outras }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input
        {...outras}
        type={visivel ? "text" : "password"}
        id={id}
        name={name}
        value={valor}
        onChange={aoAlterar}
        autoComplete={autoComplete}
        maxLength={LIMITE_SENHA}
        className={`${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-texto-fraco hover:text-texto cursor-pointer"
      >
        {visivel ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

export default CampoSenha;
