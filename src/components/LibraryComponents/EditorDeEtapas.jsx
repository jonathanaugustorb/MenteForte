import { useEffect, useId, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { LIMITE_ETAPAS, LIMITE_POR_ETAPA } from "./exercicioCampos";
import { estiloDeBotao } from "../ui/estiloDeBotao";
import { ESTILO_ENTRADA, ESTILO_ROTULO } from "../ui/estiloDeCampo";

const ESTILO_REMOVER =
  "rounded-md p-1 text-texto-suave hover:bg-white/10 hover:text-perigo cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";

function EditorDeEtapas({ etapas, aoMudar }) {
  const idBase = useId();
  const proximoFoco = useRef(null);
  const campoId = (indice) => `${idBase}-etapa-${indice}`;
  const limiteAtingido = etapas.length >= LIMITE_ETAPAS;

  useEffect(() => {
    if (proximoFoco.current === null) return;

    document.getElementById(campoId(proximoFoco.current))?.focus();
    proximoFoco.current = null;
  });

  function alterar(indice, texto) {
    const semQuebra = texto.replace(/\r?\n/g, " ");
    aoMudar(etapas.map((etapa, posicao) => (posicao === indice ? semQuebra : etapa)));
  }

  function adicionar() {
    proximoFoco.current = etapas.length;
    aoMudar([...etapas, ""]);
  }

  function remover(indice) {
    proximoFoco.current = Math.max(indice - 1, 0);
    aoMudar(etapas.filter((_, posicao) => posicao !== indice));
  }

  function aoTeclar(evento, indice) {
    if (evento.key !== "Enter") return;

    evento.preventDefault();

    if (indice < etapas.length - 1) {
      document.getElementById(campoId(indice + 1))?.focus();
      return;
    }

    if (!limiteAtingido && etapas[indice].trim()) adicionar();
  }

  return (
    <div role="group" aria-labelledby={`${idBase}-titulo`} className="flex flex-col gap-3">
      <span id={`${idBase}-titulo`} className={ESTILO_ROTULO}>
        Etapas da execução
        <span aria-hidden="true" className="ml-0.5 text-marca-400">
          *
        </span>
      </span>

      {etapas.map((etapa, indice) => {
        const numero = indice + 1;
        const acimaDoLimite = etapa.length > LIMITE_POR_ETAPA;

        return (
          <div key={indice} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={campoId(indice)} className="text-xs font-medium text-texto-fraco">
                Etapa {numero}
              </label>
              <button
                type="button"
                onClick={() => remover(indice)}
                disabled={etapas.length <= 1}
                aria-label={`Remover a etapa ${numero}`}
                className={ESTILO_REMOVER}
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
            <textarea
              id={campoId(indice)}
              value={etapa}
              onChange={(evento) => alterar(indice, evento.target.value)}
              onKeyDown={(evento) => aoTeclar(evento, indice)}
              rows={2}
              maxLength={LIMITE_POR_ETAPA}
              aria-invalid={acimaDoLimite}
              aria-describedby={`${campoId(indice)}-contador`}
              placeholder="Descreva esta etapa"
              className={`${ESTILO_ENTRADA} field-sizing-content`}
            />
            <span
              id={`${campoId(indice)}-contador`}
              className={`self-end text-xs ${acimaDoLimite ? "text-perigo" : "text-texto-fraco"}`}
            >
              {etapa.length}/{LIMITE_POR_ETAPA}
            </span>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={adicionar}
          disabled={limiteAtingido}
          className={estiloDeBotao({ variante: "secundario", tamanho: "pequeno" })}
        >
          <Plus size={16} aria-hidden="true" />
          Adicionar etapa
        </button>
        <span className="text-xs text-texto-fraco">
          {etapas.length} de {LIMITE_ETAPAS} etapas
        </span>
      </div>
    </div>
  );
}

export default EditorDeEtapas;
