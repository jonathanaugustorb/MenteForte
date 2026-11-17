import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "./ui/Alerta";
import Botao from "./ui/Botao";
import Campo from "./ui/Campo";
import CampoSenha from "./ui/CampoSenha";
import { ESTILO_ENTRADA } from "./ui/estiloDeCampo";
import { login } from "../services/authService";
import { CONTAS_DE_TESTE, SENHA_DE_TESTE } from "../demo/contasDeTeste";
import { LIMITE_EMAIL } from "../utils/limites";

function FormLogin({ aoEntrar, aoFechar }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function alterar(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function entrarCom(email, senha) {
    setEnviando(true);
    setErro(null);
    try {
      aoEntrar(await login(email, senha));
    } catch (falha) {
      setErro(falha.mensagem || "Não foi possível entrar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  function enviar(evento) {
    evento.preventDefault();
    entrarCom(form.email, form.senha);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-titulo text-2xl font-bold text-texto">Entrar no MenteForte</h2>
        <p className="mt-1 text-sm text-texto-suave">
          Versão de demonstração: use uma conta de teste ou a conta que você criou.
        </p>
      </div>

      <form onSubmit={enviar} className="space-y-4">
        <Campo id="login-email" rotulo="E-mail">
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={alterar}
            autoComplete="email"
            maxLength={LIMITE_EMAIL}
            required
            placeholder="voce@exemplo.com"
            className={ESTILO_ENTRADA}
          />
        </Campo>

        <Campo id="login-senha" rotulo="Senha">
          <CampoSenha
            id="login-senha"
            name="senha"
            valor={form.senha}
            aoAlterar={alterar}
            autoComplete="current-password"
            required
            placeholder="Sua senha"
          />
        </Campo>

        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        <Botao type="submit" larguraTotal disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </Botao>
      </form>

      <div className="rounded-xl border border-borda bg-fundo/60 p-4">
        <p className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
          Entrar com uma conta de teste
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {CONTAS_DE_TESTE.map((conta) => (
            <Botao
              key={conta.email}
              variante="secundario"
              tamanho="pequeno"
              disabled={enviando}
              onClick={() => entrarCom(conta.email, SENHA_DE_TESTE)}
            >
              {conta.rotulo}
            </Botao>
          ))}
        </div>
        <p className="mt-3 text-xs text-texto-fraco">
          Senha das contas de teste: <span className="font-mono text-texto-suave">{SENHA_DE_TESTE}</span>
        </p>
      </div>

      <p className="text-center text-sm text-texto-suave">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" onClick={aoFechar} className="font-semibold text-marca-300 hover:text-marca-200">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

export default FormLogin;
