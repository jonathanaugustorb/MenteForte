import ConteudoExercicio from "./ConteudoExercicio";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function DetalheExercicio({ exercicio, rotuloGrupo, rotuloNivel, aoFechar, children }) {
  return (
    <div className="space-y-4 py-2 sm:p-4">
      <h2 className="pr-8 font-titulo text-2xl font-bold text-texto wrap-anywhere">
        {exercicio.nome}
      </h2>
      <div className="h-px w-full bg-borda"></div>

      <ConteudoExercicio
        exercicio={exercicio}
        rotuloGrupo={rotuloGrupo}
        rotuloNivel={rotuloNivel}
      />

      {children}

      <button
        type="button"
        onClick={aoFechar}
        className={estiloDeBotao({ larguraTotal: true })}
      >
        Fechar
      </button>
    </div>
  );
}

export default DetalheExercicio;
