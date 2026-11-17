import { useState } from "react";
import { formatarDataCurta } from "../../utils/formatar";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const ESTILO_LISTA = "mt-2 list-disc pl-5 text-sm text-texto-suave space-y-1";
const ESTILO_SUBTITULO = "text-xs font-semibold tracking-wider text-texto-fraco uppercase";

function ConfirmarAnonimizacao({ usuario, aoConfirmar, aoCancelar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function confirmar() {
    setEnviando(true);
    setErro(null);
    try {
      await aoConfirmar();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível anonimizar esta conta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Anonimizar conta</h2>
      <p className="mb-5 text-sm text-texto-fraco">
        Cumprimento do pedido de exclusão previsto no art. 18 da LGPD.
      </p>
      <div className="mb-5 rounded-xl border border-marca-500 p-4">
        <p className="text-sm text-marca-200">
          <strong>Esta ação não tem volta.</strong> Os dados pessoais são apagados
          do banco e não há como recuperá-los.
        </p>
      </div>
      <div className="mb-5 rounded-xl border border-borda p-4">
        <span className="block text-xs text-texto-fraco">Conta</span>
        <span className="block text-white">{usuario.nomeCompleto}</span>
        <span className="block text-sm text-texto-fraco">{usuario.email}</span>
        <span className="mt-2 block text-xs text-texto-fraco">
          Exclusão pedida em {formatarDataCurta(usuario.anonimizacaoSolicitadaEm)}
        </span>
      </div>
      <h3 className={ESTILO_SUBTITULO}>O que será apagado</h3>
      <ul className={ESTILO_LISTA}>
        <li>Nome, e-mail e senha</li>
        <li>Resultados nos quizzes</li>
      </ul>
      <h3 className={`${ESTILO_SUBTITULO} mt-5`}>O que permanece</h3>
      <ul className={ESTILO_LISTA}>
        <li>O registro do aceite dos Termos e da Política, como prova do consentimento</li>
        <li>Os artigos publicados, sem identificar o autor</li>
        <li>O registro desta anonimização na trilha de auditoria</li>
      </ul>
      {erro && <p className="mt-5 text-sm text-perigo">{erro}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={aoCancelar} disabled={enviando} className={estiloDeBotao({ variante: "secundario" })}>
          Cancelar
        </button>
        <button type="button" onClick={confirmar} disabled={enviando} className={estiloDeBotao({ variante: "perigo" })}>
          {enviando ? "Anonimizando..." : "Anonimizar definitivamente"}
        </button>
      </div>
    </div>
  );
}

export default ConfirmarAnonimizacao;
