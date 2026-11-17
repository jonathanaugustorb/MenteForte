import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { KeyRound, Mail, PencilLine } from "lucide-react";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import Cartao from "../components/ui/Cartao";
import Container from "../components/ui/Container";
import EstadoRequisicao from "../components/ui/EstadoRequisicao";
import Etiqueta from "../components/ui/Etiqueta";
import Alerta from "../components/ui/Alerta";
import Botao from "../components/ui/Botao";
import Modal from "../components/ui/Modal";
import ConfirmarExclusaoConta from "../components/ConfirmarExclusaoConta";
import EditarMeusDados from "../components/EditarMeusDados";
import AlterarSenha from "../components/AlterarSenha";
import AlterarEmail from "../components/AlterarEmail";
import BaixarMeusDados from "../components/BaixarMeusDados";
import { formatarDataCurta } from "../utils/formatar";
import { rotuloDoPapel } from "../utils/papeis";
import { EMAIL_CONTATO } from "../utils/contato";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import {
  alterarMinhaSenha,
  atualizarMinhaConta,
  buscarMinhaConta,
  cancelarExclusaoDaMinhaConta,
  solicitarExclusaoDaMinhaConta,
  trocarMeuEmail,
} from "../services/usuarioService";

const ESTILO_TITULO_DO_CARTAO = "font-titulo text-lg font-bold text-texto";

function Dado({ rotulo, children }) {
  return (
    <div>
      <dt className="text-xs font-medium text-texto-fraco">{rotulo}</dt>
      <dd className="mt-1 text-texto wrap-anywhere">{children || "—"}</dd>
    </div>
  );
}

function MinhaContaPages() {
  const { aoRenomear, avisar } = useOutletContext();
  const [conta, setConta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [janela, setJanela] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    buscarMinhaConta()
      .then((dados) => {
        if (!ativo) return;
        setConta(dados);
        setErro(null);
      })
      .catch((falha) => {
        if (ativo) setErro(falha.mensagem || "Não foi possível carregar os seus dados.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [versao]);

  function fecharJanela() {
    setJanela(null);
  }

  function recarregar() {
    setVersao((atual) => atual + 1);
  }

  async function salvarDados(dados) {
    const atualizada = await atualizarMinhaConta(dados);
    setConta(atualizada);
    aoRenomear(atualizada.nomeCompleto);
    fecharJanela();
    avisar({ tipo: "sucesso", titulo: "Dados atualizados", mensagem: "As alterações foram salvas." });
  }

  async function trocarEmail(novoEmail, senhaAtual) {
    const atualizada = await trocarMeuEmail(novoEmail, senhaAtual);
    setConta(atualizada);
    fecharJanela();
    avisar({
      tipo: "sucesso",
      titulo: "E-mail alterado",
      mensagem: `A partir de agora, entre com ${atualizada.email}.`,
    });
  }

  async function alterarSenha(senhaAtual, novaSenha) {
    await alterarMinhaSenha(senhaAtual, novaSenha);
    fecharJanela();
    avisar({ tipo: "sucesso", titulo: "Senha alterada", mensagem: "Use a nova senha no próximo login." });
  }

  async function pedirExclusao() {
    await solicitarExclusaoDaMinhaConta();
    fecharJanela();
    recarregar();
    avisar({
      tipo: "sucesso",
      titulo: "Pedido de exclusão registrado",
      mensagem: "Um administrador vai cumprir o pedido. Até lá, sua conta continua funcionando e você pode desistir.",
    });
  }

  async function desistirDaExclusao() {
    setCancelando(true);
    try {
      await cancelarExclusaoDaMinhaConta();
      recarregar();
      avisar({ tipo: "sucesso", titulo: "Pedido cancelado", mensagem: "Sua conta continua ativa, com todos os dados." });
    } catch (falha) {
      avisar({ tipo: "erro", titulo: "Pedido não cancelado", mensagem: falha.mensagem || "Tente novamente." });
    } finally {
      setCancelando(false);
    }
  }

  const administrador = conta?.papel === "ADMINISTRADOR";
  const anonimizada = Boolean(conta?.anonimizadoEm);

  return (
    <Container largura="estreita" className="pb-16">
      <CabecalhoPagina
        titulo="Minha conta"
        subtitulo="Os dados que o MenteForte guarda sobre você e o que fazer com eles."
        icone={ICONES_DAS_PAGINAS.meusDados}
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando seus dados..."
        erro={erro}
        vazio={!conta}
        mensagemVazio="Não encontramos os seus dados."
      >
        {conta && (
          <div className="space-y-6">
            <Cartao className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className={ESTILO_TITULO_DO_CARTAO}>Seus dados</h2>
                <Etiqueta tom={conta.ativo ? "sucesso" : "neutra"}>{conta.ativo ? "Conta ativa" : "Conta inativa"}</Etiqueta>
              </div>

              <dl className="grid gap-5 sm:grid-cols-2">
                <Dado rotulo="Nome completo">{conta.nomeCompleto}</Dado>
                <Dado rotulo="E-mail">{conta.email}</Dado>
                <Dado rotulo="Perfil">{rotuloDoPapel(conta.papel)}</Dado>
                <Dado rotulo="Cadastrada em">{formatarDataCurta(conta.criadoEm)}</Dado>
              </dl>

              {anonimizada ? (
                <Alerta tipo="aviso">
                  Conta anonimizada em {formatarDataCurta(conta.anonimizadoEm)}. Os dados pessoais foram
                  apagados e não podem mais ser alterados.
                </Alerta>
              ) : (
                <div className="flex flex-wrap gap-3 border-t border-borda pt-5">
                  <Botao variante="secundario" onClick={() => setJanela("dados")}>
                    <PencilLine size={16} aria-hidden="true" />
                    Editar nome
                  </Botao>
                  <Botao variante="secundario" onClick={() => setJanela("email")}>
                    <Mail size={16} aria-hidden="true" />
                    Alterar e-mail
                  </Botao>
                  <Botao variante="secundario" onClick={() => setJanela("senha")}>
                    <KeyRound size={16} aria-hidden="true" />
                    Alterar senha
                  </Botao>
                </div>
              )}
            </Cartao>

            {!anonimizada && (
              <Cartao className="space-y-4">
                <h2 className={ESTILO_TITULO_DO_CARTAO}>Portabilidade dos dados</h2>
                <p className="text-sm leading-relaxed text-texto-suave">
                  Baixe uma cópia dos seus dados em JSON, um formato aberto, com a sua conta e os seus
                  resultados nos quizzes. Para o professor, vêm também os conteúdos que ele enviou. É o
                  direito de portabilidade previsto no art. 18 da LGPD.
                </p>
                <BaixarMeusDados />
              </Cartao>
            )}

            {!administrador && !anonimizada && (
              <Cartao className="space-y-4 border-perigo/30">
                <h2 className={ESTILO_TITULO_DO_CARTAO}>Excluir minha conta</h2>
                {conta.anonimizacaoSolicitadaEm ? (
                  <>
                    <Alerta tipo="aviso" titulo={`Exclusão pedida em ${formatarDataCurta(conta.anonimizacaoSolicitadaEm)}`}>
                      Sua conta continua funcionando até um administrador cumprir o pedido. Mudou de ideia?
                      Você pode desistir enquanto isso.
                    </Alerta>
                    <Botao variante="secundario" onClick={desistirDaExclusao} disabled={cancelando}>
                      {cancelando ? "Cancelando..." : "Desistir da exclusão"}
                    </Botao>
                  </>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed text-texto-suave">
                      Você pode pedir que os seus dados pessoais sejam apagados. Um administrador cumpre o
                      pedido; até lá, sua conta continua funcionando e você pode desistir.
                    </p>
                    <Botao variante="perigo" onClick={() => setJanela("exclusao")}>
                      Pedir a exclusão da conta
                    </Botao>
                  </>
                )}
              </Cartao>
            )}
          </div>
        )}
      </EstadoRequisicao>

      <p className="mt-8 text-sm text-texto-fraco">
        Dúvidas sobre a sua conta? Escreva para{" "}
        <a href={`mailto:${EMAIL_CONTATO}`} className="text-marca-300 underline underline-offset-4 hover:text-marca-200">
          {EMAIL_CONTATO}
        </a>
        , um endereço fictício desta demonstração.
      </p>

      <Modal aberto={janela === "dados"} aoFechar={fecharJanela} largura="estreita">
        {conta && <EditarMeusDados conta={conta} aoSalvar={salvarDados} aoCancelar={fecharJanela} />}
      </Modal>
      <Modal aberto={janela === "email"} aoFechar={fecharJanela} largura="estreita">
        {conta && <AlterarEmail emailAtual={conta.email} aoTrocar={trocarEmail} aoFechar={fecharJanela} />}
      </Modal>
      <Modal aberto={janela === "senha"} aoFechar={fecharJanela} largura="estreita">
        <AlterarSenha aoAlterar={alterarSenha} aoFechar={fecharJanela} />
      </Modal>
      <Modal aberto={janela === "exclusao"} aoFechar={fecharJanela}>
        <ConfirmarExclusaoConta aoConfirmar={pedirExclusao} aoCancelar={fecharJanela} />
      </Modal>
    </Container>
  );
}

export default MinhaContaPages;
