import { useState } from "react";
import Modal from "../ui/Modal";
import { excluirQuiz } from "../../services/quizService";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function ExcluirQuiz({ quiz, aoExcluir }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function fecharModal() {
    setModalAberto(false);
    setErro(null);
  }

  async function confirmarExclusao() {
    setEnviando(true);
    setErro(null);

    try {
      await excluirQuiz(quiz.id);
      aoExcluir();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível excluir o quiz.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalAberto(true)}
        className={estiloDeBotao({ variante: "contorno" })}
      >
        Excluir
      </button>

      <Modal aberto={modalAberto} aoFechar={fecharModal}>
        <div className="max-w-md space-y-4 p-4">
          <h2 className="text-xl font-bold text-white">Excluir quiz</h2>
          <p className="text-sm text-texto-suave">
            O quiz "{quiz.titulo}" e as notas de quem já respondeu serão apagados. Esta
            ação não tem volta.
          </p>
          {erro && (
            <p role="alert" className="text-sm text-perigo">
              {erro}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={fecharModal}
              disabled={enviando}
              className={estiloDeBotao({ variante: "secundario" })}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarExclusao}
              disabled={enviando}
              className={estiloDeBotao()}
            >
              {enviando ? "Excluindo..." : "Excluir quiz"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ExcluirQuiz;
