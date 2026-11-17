import { useState } from "react";
import Alerta from "./ui/Alerta";
import Botao from "./ui/Botao";
import Campo from "./ui/Campo";
import CampoSenha from "./ui/CampoSenha";
import { SENHA_MINIMA } from "../utils/limites";

function AlterarSenha({ aoAlterar, aoFechar }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const senhaCurta = novaSenha !== "" && novaSenha.length < SENHA_MINIMA;
  const confirmou = confirmacao !== "";
  const senhasCoincidem = confirmou && confirmacao === novaSenha;
  const podeEnviar = senhaAtual !== "" && novaSenha.length >= SENHA_MINIMA && senhasCoincidem && !enviando;

  async function alterar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await aoAlterar(senhaAtual, novaSenha);
    } catch (falha) {
      setErro(falha.mensagem || "Não foi possível alterar a senha.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={alterar} className="space-y-5">
      <h2 className="font-titulo text-xl font-bold text-texto">Alterar senha</h2>

      <Campo id="senha-atual" rotulo="Senha atual" obrigatorio>
        <CampoSenha
          id="senha-atual"
          valor={senhaAtual}
          aoAlterar={(evento) => setSenhaAtual(evento.target.value)}
          autoComplete="current-password"
        />
      </Campo>

      <Campo
        id="nova-senha"
        rotulo="Nova senha"
        dica={`Mínimo de ${SENHA_MINIMA} caracteres.`}
        erro={senhaCurta ? `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.` : null}
        obrigatorio
      >
        <CampoSenha
          id="nova-senha"
          valor={novaSenha}
          aoAlterar={(evento) => setNovaSenha(evento.target.value)}
          autoComplete="new-password"
          aria-invalid={senhaCurta}
          aria-describedby={senhaCurta ? "nova-senha-erro" : "nova-senha-dica"}
        />
      </Campo>

      <Campo
        id="confirma-nova-senha"
        rotulo="Confirme a nova senha"
        erro={confirmou && !senhasCoincidem ? "As senhas não são iguais." : null}
        obrigatorio
      >
        <CampoSenha
          id="confirma-nova-senha"
          valor={confirmacao}
          aoAlterar={(evento) => setConfirmacao(evento.target.value)}
          autoComplete="new-password"
          aria-invalid={confirmou && !senhasCoincidem}
          aria-describedby="confirma-nova-senha-erro"
        />
      </Campo>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <div className="flex justify-end gap-3">
        <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={!podeEnviar}>
          {enviando ? "Salvando..." : "Alterar senha"}
        </Botao>
      </div>
    </form>
  );
}

export default AlterarSenha;
