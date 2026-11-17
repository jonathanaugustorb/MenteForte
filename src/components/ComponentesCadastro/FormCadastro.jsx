import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Alerta from "../ui/Alerta";
import Botao from "../ui/Botao";
import Campo from "../ui/Campo";
import CampoSenha from "../ui/CampoSenha";
import Cartao from "../ui/Cartao";
import { ESTILO_ENTRADA, ESTILO_ROTULO } from "../ui/estiloDeCampo";
import EscolhaDePerfil from "./EscolhaDePerfil";
import AceiteDosDocumentos from "./AceiteDosDocumentos";
import { criarUsuario } from "../../services/usuarioService";
import { login } from "../../services/authService";
import { listarDocumentos } from "../../services/documentoLegalService";
import { rotuloDoPapel } from "../../utils/papeis";
import { LIMITE_EMAIL, LIMITE_NOME_COMPLETO, SENHA_MINIMA } from "../../utils/limites";

const FORMULARIO_VAZIO = {
  nomeCompleto: "",
  email: "",
  confirmaEmail: "",
  senha: "",
  confirmaSenha: "",
  papel: "ALUNO",
};

const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

function FormCadastro() {
  const { aoEntrar, avisar } = useOutletContext();
  const [form, setForm] = useState(FORMULARIO_VAZIO);
  const [documentos, setDocumentos] = useState(null);
  const [erroDocumentos, setErroDocumentos] = useState(null);
  const [aceites, setAceites] = useState({ termos: false, politica: false });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  useEffect(() => {
    let ativo = true;
    listarDocumentos()
      .then((lista) => {
        if (ativo) setDocumentos(lista);
      })
      .catch(() => {
        if (ativo) setErroDocumentos("Não foi possível carregar os Termos de Uso. Recarregue a página.");
      });
    return () => {
      ativo = false;
    };
  }, []);

  const emailValido = FORMATO_DE_EMAIL.test(form.email.trim());
  const confirmouEmail = form.confirmaEmail !== "";
  const emailsCoincidem = confirmouEmail && normalizarEmail(form.confirmaEmail) === normalizarEmail(form.email);
  const senhaCurta = form.senha !== "" && form.senha.length < SENHA_MINIMA;
  const confirmouSenha = form.confirmaSenha !== "";
  const senhasCoincidem = confirmouSenha && form.confirmaSenha === form.senha;

  const formularioValido =
    form.nomeCompleto.trim() !== "" &&
    emailValido &&
    emailsCoincidem &&
    form.senha.length >= SENHA_MINIMA &&
    senhasCoincidem &&
    aceites.termos &&
    aceites.politica &&
    documentos !== null;

  function alterar(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  function versaoDo(tipo) {
    return documentos?.find((documento) => documento.tipo === tipo)?.versao ?? null;
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (!formularioValido) return;

    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      await criarUsuario({
        nomeCompleto: form.nomeCompleto,
        email: form.email,
        senha: form.senha,
        papel: form.papel,
        aceitouTermosUso: aceites.termos,
        aceitouPoliticaPrivacidade: aceites.politica,
        versaoTermosUso: versaoDo("TERMOS_USO"),
        versaoPoliticaPrivacidade: versaoDo("POLITICA_PRIVACIDADE"),
      });
      aoEntrar(await login(form.email, form.senha));
      avisar({
        tipo: "sucesso",
        titulo: "Conta criada",
        mensagem: `Você entrou como ${rotuloDoPapel(form.papel).toLowerCase()}. Bons estudos!`,
      });
    } catch (falha) {
      setCamposComErro(falha.campos ?? []);
      setErro(falha.mensagem || "Não foi possível criar a conta. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <Cartao como="form" onSubmit={enviar} noValidate className="space-y-8 sm:p-8">
      <section className="space-y-5">
        <h2 className="font-titulo text-lg font-bold text-texto">Seus dados</h2>

        <Campo id="nomeCompleto" rotulo="Nome completo" dica="Pode ser um nome fictício." obrigatorio>
          <input
            id="nomeCompleto"
            name="nomeCompleto"
            value={form.nomeCompleto}
            onChange={alterar}
            maxLength={LIMITE_NOME_COMPLETO}
            autoComplete="name"
            aria-describedby="nomeCompleto-dica"
            className={ESTILO_ENTRADA}
          />
        </Campo>

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="email" rotulo="E-mail" obrigatorio>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={alterar}
              maxLength={LIMITE_EMAIL}
              autoComplete="email"
              placeholder="voce@exemplo.com"
              className={ESTILO_ENTRADA}
            />
          </Campo>
          <Campo
            id="confirmaEmail"
            rotulo="Confirme o e-mail"
            erro={confirmouEmail && !emailsCoincidem ? "Os e-mails não são iguais." : null}
            obrigatorio
          >
            <input
              id="confirmaEmail"
              name="confirmaEmail"
              type="email"
              value={form.confirmaEmail}
              onChange={alterar}
              maxLength={LIMITE_EMAIL}
              autoComplete="email"
              aria-invalid={confirmouEmail && !emailsCoincidem}
              aria-describedby="confirmaEmail-erro"
              className={ESTILO_ENTRADA}
            />
          </Campo>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo
            id="senha"
            rotulo="Senha"
            dica={`Mínimo de ${SENHA_MINIMA} caracteres. Não use uma senha real.`}
            erro={senhaCurta ? `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.` : null}
            obrigatorio
          >
            <CampoSenha
              id="senha"
              name="senha"
              valor={form.senha}
              aoAlterar={alterar}
              autoComplete="new-password"
              aria-invalid={senhaCurta}
              aria-describedby={senhaCurta ? "senha-erro" : "senha-dica"}
            />
          </Campo>
          <Campo
            id="confirmaSenha"
            rotulo="Confirme a senha"
            erro={confirmouSenha && !senhasCoincidem ? "As senhas não são iguais." : null}
            obrigatorio
          >
            <CampoSenha
              id="confirmaSenha"
              name="confirmaSenha"
              valor={form.confirmaSenha}
              aoAlterar={alterar}
              autoComplete="new-password"
              aria-invalid={confirmouSenha && !senhasCoincidem}
              aria-describedby="confirmaSenha-erro"
            />
          </Campo>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-titulo text-lg font-bold text-texto">Perfil da conta</h2>
          <p className={`${ESTILO_ROTULO} mt-1 font-normal text-texto-suave`}>
            Escolha como você quer testar o MenteForte. Dá para criar outra conta depois com outro perfil.
          </p>
        </div>
        <EscolhaDePerfil valor={form.papel} aoAlterar={alterar} />
      </section>

      <AceiteDosDocumentos
        documentos={documentos}
        erro={erroDocumentos}
        aceites={aceites}
        aoAlterar={setAceites}
      />

      {erro && (
        <Alerta tipo="erro" titulo="Cadastro não realizado">
          {camposComErro.length > 0 ? (
            <ul className="list-disc pl-5">
              {camposComErro.map((campo) => (
                <li key={campo.campo}>{campo.mensagem}</li>
              ))}
            </ul>
          ) : (
            <p>{erro}</p>
          )}
        </Alerta>
      )}

      <Botao type="submit" tamanho="grande" larguraTotal disabled={!formularioValido || enviando}>
        {enviando ? "Criando conta..." : "Criar conta e entrar"}
      </Botao>
    </Cartao>
  );
}

export default FormCadastro;
