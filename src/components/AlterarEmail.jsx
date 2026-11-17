import { useState } from "react";
import Alerta from "./ui/Alerta";
import Botao from "./ui/Botao";
import Campo from "./ui/Campo";
import CampoSenha from "./ui/CampoSenha";
import { ESTILO_ENTRADA } from "./ui/estiloDeCampo";
import { LIMITE_EMAIL } from "../utils/limites";

function AlterarEmail({ emailAtual, aoTrocar, aoFechar }) {
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const podeEnviar = novoEmail.trim() !== "" && senhaAtual !== "" && !enviando;

  async function trocar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await aoTrocar(novoEmail.trim(), senhaAtual);
    } catch (falha) {
      setErro(falha.mensagem || "Não foi possível alterar o e-mail.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={trocar} className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-titulo text-xl font-bold text-texto">Alterar e-mail</h2>
        <p className="text-sm text-texto-suave">
          E-mail atual: <span className="font-medium text-texto">{emailAtual}</span>
        </p>
      </div>

      <Campo id="novo-email" rotulo="Novo e-mail" obrigatorio>
        <input
          id="novo-email"
          type="email"
          value={novoEmail}
          onChange={(evento) => setNovoEmail(evento.target.value)}
          maxLength={LIMITE_EMAIL}
          autoComplete="email"
          className={ESTILO_ENTRADA}
        />
      </Campo>

      <Campo id="email-senha-atual" rotulo="Senha atual" dica="Para confirmar que é você." obrigatorio>
        <CampoSenha
          id="email-senha-atual"
          valor={senhaAtual}
          aoAlterar={(evento) => setSenhaAtual(evento.target.value)}
          autoComplete="current-password"
          aria-describedby="email-senha-atual-dica"
        />
      </Campo>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <div className="flex justify-end gap-3">
        <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={!podeEnviar}>
          {enviando ? "Salvando..." : "Alterar e-mail"}
        </Botao>
      </div>
    </form>
  );
}

export default AlterarEmail;
