import { useOutletContext } from "react-router-dom";
import AprovarExercicio from "./AprovarExercicio";
import ValidacaoExercicio from "./ValidacaoExercicio";
import { estaEmAnalise } from "../../utils/moderacao";
import { podeValidar } from "../../utils/papeis";

function ModeracaoExercicio({ exercicio, aoAprovar, aoDecidir }) {
  const { usuario } = useOutletContext();

  if (!exercicio.status) return null;

  return (
    <>
      {exercicio.motivoRejeicao && (
        <div className="rounded-xl border border-marca-500 p-4">
          <p className="text-sm font-semibold text-marca-400">
            Motivo da rejeição
          </p>
          <p className="mt-1 text-sm text-texto-suave wrap-anywhere">{exercicio.motivoRejeicao}</p>
        </div>
      )}

      {exercicio.podeAprovar && (
        <AprovarExercicio exercicio={exercicio} aoAprovar={aoAprovar} />
      )}

      {podeValidar(usuario) && estaEmAnalise(exercicio) && (
        <ValidacaoExercicio exercicio={exercicio} aoAlterarStatus={aoDecidir} />
      )}
    </>
  );
}

export default ModeracaoExercicio;
