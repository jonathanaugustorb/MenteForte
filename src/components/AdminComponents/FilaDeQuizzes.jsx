import { Fragment, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import EstadoRequisicao from "../ui/EstadoRequisicao";
import ValidacaoQuiz from "../QuizComponents/ValidacaoQuiz";
import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import { listarQuizzesPendentes } from "../../services/quizService";
import { formatarDataCurta } from "../../utils/formatar";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-marca-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-texto-suave align-top";
const ESTILO_ETIQUETA = "rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap";

const CORES_DA_SITUACAO = {
  PENDENTE: "border-aviso/50 bg-aviso/15 text-aviso",
  APROVADO_PELOS_PROFESSORES: "border-sucesso/50 bg-emerald-600/20 text-sucesso",
};


function situacaoDoQuiz(quiz) {
  const descricao = STATUS_ARTIGO[quiz.status]?.descricao ?? quiz.status;
  return `${descricao} · ${quiz.aprovacoesDeProfessores} de ${quiz.aprovacoesNecessarias}`;
}

function FilaDeQuizzes() {
  const { avisar } = useOutletContext();
  const [quizzes, setQuizzes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [idAberto, setIdAberto] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarQuizzesPendentes()
      .then((lista) => {
        if (!ativo) return;
        setQuizzes(lista);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os quizzes pendentes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function alternar(id) {
    setIdAberto((atual) => (atual === id ? null : id));
  }

  function retirarDaFila(atualizado) {
    setQuizzes((atuais) => atuais.filter((quiz) => quiz.id !== atualizado.id));
    setIdAberto(null);
    avisar({
      tipo: "sucesso",
      titulo: atualizado.status === "APROVADO" ? "Quiz aprovado" : "Quiz rejeitado",
      mensagem:
        atualizado.status === "APROVADO"
          ? `"${atualizado.titulo}" está publicado no site.`
          : `"${atualizado.titulo}" foi rejeitado, e o autor vê o motivo.`,
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
          Quizzes para revisar
          {!carregando && !erro && ` (${quizzes.length})`}
        </h2>
        <p className="mt-1 text-sm text-texto-fraco">
          Quizzes que esperam a decisão do administrador. Em "Ver no site" aparecem as
          perguntas com o gabarito.
        </p>
      </div>

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando quizzes..."
        erro={erro}
        vazio={quizzes.length === 0}
        mensagemVazio="Nenhum quiz aguardando revisão."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-borda">
                <th className={ESTILO_CABECALHO}>Quiz</th>
                <th className={ESTILO_CABECALHO}>Situação</th>
                <th className={ESTILO_CABECALHO}>Enviado em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => {
                const aberto = quiz.id === idAberto;

                return (
                  <Fragment key={quiz.id}>
                    <tr className={aberto ? "" : "border-b border-borda"}>
                      <td className={`${ESTILO_CELULA} wrap-anywhere`}>
                        <span className="block text-white">{quiz.titulo}</span>
                        <span className="block text-xs text-texto-fraco">
                          por {quiz.autorNome} · {quiz.totalQuestoes} perguntas
                        </span>
                      </td>
                      <td className={ESTILO_CELULA}>
                        <span
                          className={`${ESTILO_ETIQUETA} ${
                            CORES_DA_SITUACAO[quiz.status] ?? "border-borda-forte text-texto-suave"
                          }`}
                        >
                          {situacaoDoQuiz(quiz)}
                        </span>
                      </td>
                      <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                        {formatarDataCurta(quiz.criadoEm)}
                      </td>
                      <td className={ESTILO_CELULA}>
                        <button
                          type="button"
                          aria-expanded={aberto}
                          onClick={() => alternar(quiz.id)}
                          className={estiloDeBotao({ variante: "secundario", tamanho: "pequeno" })}
                        >
                          {aberto ? "Ver −" : "Ver +"}
                        </button>
                      </td>
                    </tr>
                    {aberto && (
                      <tr className="border-b border-borda">
                        <td colSpan={4} className="pr-4 pb-6">
                          <div className="flex flex-col gap-3 pt-1">
                            <p className="text-sm leading-relaxed text-texto-suave wrap-anywhere">
                              {quiz.descricao}
                            </p>
                            <Link to={`/quiz/${quiz.id}`} className={estiloDeBotao({ variante: "secundario", tamanho: "pequeno", className: "self-start" })}>
                              Ver no site
                            </Link>
                            <ValidacaoQuiz
                              quiz={quiz}
                              aoAlterarStatus={retirarDaFila}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>
    </section>
  );
}

export default FilaDeQuizzes;
