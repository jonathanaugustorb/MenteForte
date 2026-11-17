import { useId, useState } from "react";
import ListaDeErros from "../QuizComponents/ListaDeErros";
import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import { alterarStatusExercicio } from "../../services/exercicioService";
import { estaEmAnalise } from "../../utils/moderacao";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const LIMITE_MOTIVO = 500;

function ValidacaoExercicio({ exercicio, aoAlterarStatus }) {
  const campoMotivo = useId();
  const [rejeitando, setRejeitando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  const emAnalise = estaEmAnalise(exercicio);
  const quemAprovou = exercicio.professoresQueAprovaram ?? [];

  async function alterar(status) {
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      const atualizado = await alterarStatusExercicio(
        exercicio.id,
        status,
        status === "REJEITADO" ? motivo : undefined,
      );
      setRejeitando(false);
      setMotivo("");
      aoAlterarStatus(atualizado);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível alterar a situação.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  function cancelarRejeicao() {
    setRejeitando(false);
    setMotivo("");
    setErro(null);
    setCamposComErro([]);
  }

  return (
    <div className="rounded-xl border border-borda bg-superficie p-4">
      <p className="text-sm font-semibold text-marca-400">
        Validação do administrador
      </p>
      <p className="mt-1 text-sm text-texto-suave">
        Situação atual:{" "}
        <span className="font-semibold text-white">
          {STATUS_ARTIGO[exercicio.status]?.descricao ?? exercicio.status}
        </span>
      </p>
      <p className="mt-1 text-sm text-texto-suave">
        Aprovações dos professores: {exercicio.aprovacoesDeProfessores} de{" "}
        {exercicio.aprovacoesNecessarias}
        {quemAprovou.length > 0 && ` (${quemAprovou.join(", ")})`}
      </p>

      <div className="mt-2">
        <ListaDeErros erro={erro} campos={camposComErro} />
      </div>

      {emAnalise && !rejeitando && (
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={enviando}
            onClick={() => alterar("APROVADO")}
            className={estiloDeBotao({ variante: "sucesso" })}
          >
            {enviando ? "Salvando..." : "Aprovar"}
          </button>
          <button
            type="button"
            disabled={enviando}
            onClick={() => setRejeitando(true)}
            className={estiloDeBotao()}
          >
            Rejeitar
          </button>
        </div>
      )}

      {emAnalise && rejeitando && (
        <div className="mt-3 flex flex-col gap-2">
          <label htmlFor={campoMotivo} className="text-sm text-marca-200">
            Motivo da rejeição
          </label>
          <textarea
            id={campoMotivo}
            value={motivo}
            onChange={(evento) => setMotivo(evento.target.value)}
            rows={3}
            maxLength={LIMITE_MOTIVO}
            placeholder="Explique ao autor o que precisa ser corrigido"
            className="bg-superficie-alta rounded-xl p-2 text-white"
          />
          <span className="self-end text-sm text-texto-suave">
            {motivo.length}/{LIMITE_MOTIVO}
          </span>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={enviando}
              onClick={cancelarRejeicao}
              className={estiloDeBotao({ variante: "secundario" })}
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={enviando}
              onClick={() => alterar("REJEITADO")}
              className={estiloDeBotao()}
            >
              {enviando ? "Salvando..." : "Confirmar rejeição"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidacaoExercicio;
