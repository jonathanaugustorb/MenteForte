import { useState } from "react";
import { aprovarExercicio } from "../../services/exercicioService";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function AprovarExercicio({ exercicio, aoAprovar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function aprovar() {
    setEnviando(true);
    setErro(null);

    try {
      const atualizado = await aprovarExercicio(exercicio.id);
      aoAprovar(atualizado);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível registrar a aprovação.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="rounded-xl border border-borda bg-superficie p-4">
      <p className="text-sm font-semibold text-marca-400">
        Aprovação dos professores
      </p>
      <p className="mt-1 text-sm text-texto-suave">
        Este exercício tem {exercicio.aprovacoesDeProfessores} de{" "}
        {exercicio.aprovacoesNecessarias} aprovações. Confira a técnica acima antes de aprovar.
      </p>

      {erro && (
        <p role="alert" className="mt-2 text-sm text-perigo">
          {erro}
        </p>
      )}

      <button
        type="button"
        onClick={aprovar}
        disabled={enviando}
        className={estiloDeBotao({ variante: "sucesso", className: "mt-3" })}
      >
        {enviando ? "Aprovando..." : "Aprovar"}
      </button>
    </div>
  );
}

export default AprovarExercicio;
