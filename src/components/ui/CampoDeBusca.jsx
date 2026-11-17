import { Search } from "lucide-react";
import { ESTILO_ENTRADA } from "./estiloDeCampo";
import { LIMITE_BUSCA } from "../../utils/limites";

function CampoDeBusca({ valor, aoAlterar, rotulo, placeholder }) {
  return (
    <div className="relative">
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-texto-fraco"
      />
      <input
        type="search"
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        maxLength={LIMITE_BUSCA}
        placeholder={placeholder}
        aria-label={rotulo}
        className={`${ESTILO_ENTRADA} pl-10`}
      />
    </div>
  );
}

export default CampoDeBusca;
