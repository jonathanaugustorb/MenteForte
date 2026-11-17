import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Cartao from "../components/ui/Cartao";
import EstadoRequisicao from "../components/ui/EstadoRequisicao";
import ResponderQuiz from "../components/QuizComponents/ResponderQuiz";
import GabaritoQuiz from "../components/QuizComponents/GabaritoQuiz";
import AprovarQuiz from "../components/QuizComponents/AprovarQuiz";
import ValidacaoQuiz from "../components/QuizComponents/ValidacaoQuiz";
import ExcluirQuiz from "../components/QuizComponents/ExcluirQuiz";
import { etiquetaDoArtigo } from "../components/ArticlesComponents/artigoCampos";
import { buscarQuiz } from "../services/quizService";
import { podeValidar } from "../utils/papeis";

const ESTILO_CHIP =
  "inline-flex items-center rounded-full bg-marca-600/15 px-2.5 py-0.5 text-xs font-semibold text-marca-300 ring-1 ring-inset ring-marca-500/30";

function textoDaNota(nota) {
  if (nota.concluido) return `Concluído · melhor nota ${nota.percentual}%`;
  return `Sua melhor nota: ${nota.percentual}%`;
}

function QuizPages() {
  const { id } = useParams();
  const { usuario, avisar } = useOutletContext();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    buscarQuiz(id)
      .then((dados) => {
        if (!ativo) return;
        setQuiz(dados);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setQuiz(null);
        setErro(err.mensagem || "Não foi possível carregar o quiz.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, usuario]);

  function atualizarEmSegundoPlano() {
    buscarQuiz(id)
      .then(setQuiz)
      .catch(() => {});
  }

  function aoAprovar(atualizado) {
    setQuiz(atualizado);
    avisar({
      tipo: "sucesso",
      titulo: "Aprovação registrada",
      mensagem:
        atualizado.status === "APROVADO_PELOS_PROFESSORES"
          ? "Com a sua aprovação, o quiz entrou no site."
          : `O quiz tem agora ${atualizado.aprovacoesDeProfessores} de ${atualizado.aprovacoesNecessarias} aprovações.`,
    });
  }

  function aoAlterarStatus(atualizado) {
    setQuiz(atualizado);
    avisar({
      tipo: "sucesso",
      titulo: atualizado.status === "APROVADO" ? "Quiz aprovado" : "Quiz rejeitado",
      mensagem:
        atualizado.status === "APROVADO"
          ? `"${atualizado.titulo}" está publicado no site.`
          : `"${atualizado.titulo}" foi rejeitado, e o autor vê o motivo.`,
    });
  }

  function aoExcluir(titulo) {
    avisar({
      tipo: "sucesso",
      titulo: "Quiz excluído",
      mensagem: `"${titulo}" foi excluído.`,
    });
    navigate("/quiz");
  }

  const etiquetaStatus = quiz ? etiquetaDoArtigo(quiz) : null;
  const mostrarValidacao = Boolean(quiz) && podeValidar(usuario);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
      <Link to="/quiz" className="mt-8 inline-flex items-center gap-1.5 text-sm text-texto-suave hover:text-texto">
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para os quizzes
      </Link>

      <div className="mt-6">
        <EstadoRequisicao
          carregando={carregando}
          mensagemCarregando="Carregando quiz..."
          erro={erro}
          vazio={!quiz}
          mensagemVazio="Quiz não encontrado."
        >
          {quiz && (
            <Cartao className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={ESTILO_CHIP}>{quiz.categoria.descricao}</span>
                <span className={ESTILO_CHIP}>{quiz.nivel.descricao}</span>
                {etiquetaStatus && (
                  <span className="rounded-md bg-superficie-alta px-2 py-1 text-xs font-medium text-texto">
                    {etiquetaStatus}
                  </span>
                )}
              </div>

              <h1 className="font-titulo font-bold text-3xl text-white sm:text-4xl">{quiz.titulo}</h1>
              <p className="text-sm text-texto-fraco">
                por <span className="font-semibold text-marca-200">{quiz.autorNome}</span>
              </p>
              <p className="text-lg leading-relaxed text-texto-suave">{quiz.descricao}</p>

              <div className="flex flex-wrap justify-between gap-2 text-xs text-texto-fraco">
                <span>
                  {quiz.totalQuestoes} perguntas · nota mínima {quiz.notaMinima}%
                </span>
                {quiz.melhorTentativa && (
                  <span
                    className={quiz.melhorTentativa.concluido ? "text-sucesso" : "text-texto-suave"}
                  >
                    {textoDaNota(quiz.melhorTentativa)}
                  </span>
                )}
              </div>

              {quiz.artigos.length > 0 && (
                <div className="rounded-xl border border-borda p-4">
                  <p className="text-sm font-semibold text-marca-400">
                    Leitura sugerida
                  </p>
                  <ul className="mt-2 flex flex-col gap-1 text-sm">
                    {quiz.artigos.map((artigo) => (
                      <li key={artigo.id}>
                        <Link
                          to={`/articles/${artigo.id}`}
                          className="text-marca-200 hover:text-white hover:underline"
                        >
                          {artigo.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {quiz.motivoRejeicao && (
                <div className="rounded-xl border border-marca-500 p-4">
                  <p className="text-sm font-semibold text-marca-400">
                    Motivo da rejeição
                  </p>
                  <p className="mt-1 text-sm text-texto-suave">{quiz.motivoRejeicao}</p>
                </div>
              )}


              {quiz.podeEditar && (
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/quiz/${quiz.id}/editar`}
                    className="rounded-md border border-borda py-2 px-4 font-bold text-marca-200 hover:bg-white/10"
                  >
                    Editar
                  </Link>
                  <ExcluirQuiz
                    quiz={quiz}
                    aoExcluir={() => aoExcluir(quiz.titulo)}
                  />
                </div>
              )}

              {quiz.podeAprovar && (
                <AprovarQuiz quiz={quiz} aoAprovar={aoAprovar} />
              )}

              {mostrarValidacao && (
                <ValidacaoQuiz quiz={quiz} aoAlterarStatus={aoAlterarStatus} />
              )}

              <div className="h-px bg-superficie-alta"></div>

              {quiz.gabarito ? (
                <GabaritoQuiz quiz={quiz} />
              ) : (
                <ResponderQuiz
                  quiz={quiz}
                  aoResponder={atualizarEmSegundoPlano}
                />
              )}
            </Cartao>
          )}
        </EstadoRequisicao>
      </div>
    </div>
  );
}

export default QuizPages;
