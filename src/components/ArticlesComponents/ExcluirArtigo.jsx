import { useState } from "react";
import Modal from "../ui/Modal";
import { excluirArtigo } from "../../services/artigoService";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function ExcluirArtigo({ artigo, aoExcluir }) {
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
      await excluirArtigo(artigo.id);
      aoExcluir();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível excluir o artigo.");
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
        <div className="p-4 max-w-md space-y-4">
          <h2 className="text-marca-200 text-center font-titulo font-bold text-2xl">
            Excluir artigo
          </h2>
          <div className="w-full h-px bg-borda"></div>

          <p className="text-white">
            Tem certeza que deseja excluir{" "}
            <span className="text-marca-200">{artigo.titulo}</span>? Esta ação não
            pode ser desfeita.
          </p>

          {erro && <p className="text-perigo text-sm text-center">{erro}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={fecharModal}
              disabled={enviando}
              className={estiloDeBotao({ variante: "secundario", className: "flex-1" })}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarExclusao}
              disabled={enviando}
              className={estiloDeBotao({ className: "flex-1" })}
            >
              {enviando ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ExcluirArtigo;