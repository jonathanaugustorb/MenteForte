import { useState } from "react";
import { estiloDeBotao } from "../ui/estiloDeBotao";


function ConfirmarSituacao({ usuario, aoConfirmar, aoCancelar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const inativar = usuario.ativo;

  async function confirmar() {
    setEnviando(true);
    setErro(null);
    try {
      await aoConfirmar();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível alterar a situação desta conta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-xl pr-8">
      <h2 className="mb-5 text-xl font-bold text-white">
        {inativar ? "Inativar conta" : "Reativar conta"}
      </h2>
      <div className="mb-5 rounded-xl border border-borda p-4">
        <span className="block text-xs text-texto-fraco">Conta</span>
        <span className="block text-white">{usuario.nomeCompleto}</span>
        <span className="block text-sm text-texto-fraco">{usuario.email}</span>
      </div>
      <p className="text-sm text-texto-suave">
        {inativar
          ? "A pessoa deixa de conseguir entrar a partir do próximo login. Nenhum dado é apagado — isto não é a exclusão da LGPD."
          : "A pessoa volta a conseguir entrar com o e-mail e a senha que já tinha."}
      </p>
      {erro && <p className="mt-5 text-sm text-perigo">{erro}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={aoCancelar} disabled={enviando} className={estiloDeBotao({ variante: "secundario" })}>
          Cancelar
        </button>
        <button type="button" onClick={confirmar} disabled={enviando} className={estiloDeBotao()}>
          {enviando
            ? inativar ? "Inativando..." : "Reativando..."
            : inativar ? "Inativar" : "Reativar"}
        </button>
      </div>
    </div>
  );
}

export default ConfirmarSituacao;
