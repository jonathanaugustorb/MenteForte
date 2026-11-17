import { PAPEIS } from "../../utils/papeis";
import { LIMITE_BUSCA } from "../../utils/limites";
import { ESTILO_ENTRADA } from "../ui/estiloDeCampo";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const ESTILO_ROTULO = "text-sm text-texto-suave";

function FiltroUsuarios({ filtros, aoAlterar, aoLimpar }) {
  function handleChange(evento) {
    const { name, value } = evento.target;
    aoAlterar(name, value);
  }

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="busca" className={ESTILO_ROTULO}>
          Nome ou e-mail
        </label>
        <input
          type="search"
          id="busca"
          maxLength={LIMITE_BUSCA}
          name="busca"
          value={filtros.busca}
          onChange={handleChange}
          placeholder="Ex.: Ana ou ana@exemplo.com"
          className={`${ESTILO_ENTRADA} min-w-60`}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="papel" className={ESTILO_ROTULO}>
          Perfil
        </label>
        <select
          id="papel"
          name="papel"
          value={filtros.papel}
          onChange={handleChange}
          className={ESTILO_ENTRADA}
        >
          <option value="">Todos</option>
          {PAPEIS.map((papel) => (
            <option key={papel.codigo} value={papel.codigo}>
              {papel.rotulo}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="ativo" className={ESTILO_ROTULO}>
          Situação
        </label>
        <select
          id="ativo"
          name="ativo"
          value={filtros.ativo}
          onChange={handleChange}
          className={ESTILO_ENTRADA}
        >
          <option value="">Todas</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      <button
        type="button"
        onClick={aoLimpar}
        className={estiloDeBotao({ variante: "secundario" })}
      >
        Limpar
      </button>
    </div>
  );
}

export default FiltroUsuarios;
