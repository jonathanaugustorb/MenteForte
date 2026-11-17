import { useState } from "react";
import { aprovarQuiz } from "../../services/quizService";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function AprovarQuiz({ quiz, aoAprovar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function aprovar() {
    setEnviando(true);
    setErro(null);

    try {
      const atualizado = await aprovarQuiz(quiz.id);
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
        Este quiz tem {quiz.aprovacoesDeProfessores} de {quiz.aprovacoesNecessarias}{" "}
        aprovações. Confira as perguntas e o gabarito abaixo antes de aprovar.
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

export default AprovarQuiz;
