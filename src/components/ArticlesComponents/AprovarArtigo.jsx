import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { aprovarArtigo } from "../../services/artigoService";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function AprovarArtigo({ artigo, aoAprovar }) {
  const { avisar } = useOutletContext();
  const [enviando, setEnviando] = useState(false);

  async function aprovar() {
    setEnviando(true);

    try {
      const atualizado = await aprovarArtigo(artigo.id);
      aoAprovar(atualizado);
    } catch (err) {
      avisar({
        tipo: "erro",
        titulo: "Aprovação não registrada",
        mensagem: err.mensagem || "Não foi possível registrar a aprovação.",
      });
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
        Este artigo tem {artigo.aprovacoesDeProfessores} de{" "}
        {artigo.aprovacoesNecessarias} aprovações. Ele entra no site quando
        completar as {artigo.aprovacoesNecessarias} ou quando o administrador
        aprovar.
      </p>

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

export default AprovarArtigo;
