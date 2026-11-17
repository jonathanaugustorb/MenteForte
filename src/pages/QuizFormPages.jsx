import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import Cartao from "../components/ui/Cartao";
import EstadoRequisicao from "../components/ui/EstadoRequisicao";
import QuizForm from "../components/QuizComponents/QuizForm";
import LimiteDeCriacao from "../components/LimiteDeCriacao";
import { novoQuiz, SITUACOES_PUBLICADAS } from "../components/QuizComponents/quizCampos";
import { listarArtigos, listarCategorias } from "../services/artigoService";
import {
  buscarQuizParaEdicao,
  criarQuiz,
  editarQuiz,
  listarNiveisDoQuiz,
  listarQuizzes,
} from "../services/quizService";
import { podeValidar } from "../utils/papeis";
import { limiteDeCriacao } from "../utils/limiteCriacao";

function valoresDoQuiz(quiz, idsPublicados) {
  return {
    titulo: quiz.titulo,
    descricao: quiz.descricao,
    categoria: quiz.categoria,
    nivel: quiz.nivel,
    artigos: quiz.artigos.filter((artigoId) => idsPublicados.has(artigoId)),
    questoes: quiz.questoes.map((questao) => ({
      enunciado: questao.enunciado,
      explicacao: questao.explicacao ?? "",
      alternativas: questao.alternativas.map((alternativa) => ({
        texto: alternativa.texto,
        correta: alternativa.correta,
      })),
    })),
  };
}

function avisoAoSalvar(quiz, editando) {
  if (quiz.status === "PENDENTE") {
    return {
      tipo: "sucesso",
      titulo: editando ? "Quiz atualizado" : "Quiz enviado",
      mensagem: `"${quiz.titulo}" aparece no site depois de aprovado.`,
    };
  }
  return {
    tipo: "sucesso",
    titulo: editando ? "Quiz atualizado" : "Quiz publicado",
    mensagem: `"${quiz.titulo}" já está no site.`,
  };
}

function QuizFormPages() {
  const { id } = useParams();
  const editando = Boolean(id);
  const { usuario, avisar } = useOutletContext();
  const navigate = useNavigate();
  const [opcoes, setOpcoes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroAoCarregar, setErroAoCarregar] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [camposComErro, setCamposComErro] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const criacaoBloqueada = !editando && limiteDeCriacao(quizzes, usuario).bloqueado;

  useEffect(() => {
    let ativo = true;

    Promise.all([
      listarCategorias(),
      listarNiveisDoQuiz(),
      listarArtigos(),
      editando ? buscarQuizParaEdicao(id) : novoQuiz(),
      !editando && usuario?.papel === "PROFESSOR" ? listarQuizzes() : [],
    ])
      .then(([categorias, niveis, artigos, quiz, listaQuizzes]) => {
        if (!ativo) return;
        const publicados = artigos.filter((artigo) =>
          SITUACOES_PUBLICADAS.includes(artigo.status),
        );
        const idsPublicados = new Set(publicados.map((artigo) => artigo.id));
        setOpcoes({
          categorias,
          niveis,
          artigos: publicados,
          valoresIniciais: valoresDoQuiz(quiz, idsPublicados),
        });
        setErroAoCarregar(null);
        setQuizzes(listaQuizzes);
      })
      .catch((err) => {
        if (!ativo) return;
        setOpcoes(null);
        setErroAoCarregar(err.mensagem || "Não foi possível carregar o formulário.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, editando, usuario]);

  async function salvar(dados) {
    setEnviando(true);
    setCamposComErro([]);

    try {
      const corpo = { ...dados, categoria: dados.categoria || null, nivel: dados.nivel || null };
      const salvo = editando
        ? await editarQuiz(id, corpo)
        : await criarQuiz(corpo);
      avisar(avisoAoSalvar(salvo, editando));
      navigate(`/quiz/${salvo.id}`);
    } catch (err) {
      if (err.itensDoLimite) setQuizzes(err.itensDoLimite);
      const campos = err.campos ?? [];
      setCamposComErro(campos);
      avisar({
        tipo: "erro",
        titulo: "Quiz não salvo",
        mensagem: campos.length
          ? campos.map((campo) => campo.mensagem).join(" ")
          : err.mensagem || "Não foi possível salvar o quiz.",
      });
    } finally {
      setEnviando(false);
    }
  }

  const destinoAoCancelar = editando ? `/quiz/${id}` : "/quiz";
  const voltaParaModeracao = editando && !podeValidar(usuario);
  const textoBotao = voltaParaModeracao
    ? "Salvar e enviar para aprovação"
    : editando
      ? "Salvar alterações"
      : "Enviar quiz";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
      <CabecalhoPagina
        titulo={editando ? "Editar quiz" : "Novo quiz"}
        subtitulo="O quiz de um professor passa pela moderação antes de aparecer no site, como os artigos."
        icone={ICONES_DAS_PAGINAS.quiz}
      />

      <Link
        to={destinoAoCancelar}
        className="inline-flex items-center gap-1.5 text-sm text-texto-suave hover:text-texto"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {editando ? "Voltar para o quiz" : "Voltar para os quizzes"}
      </Link>

      <div className="mt-6">
        <EstadoRequisicao
          carregando={carregando}
          mensagemCarregando="Carregando o formulário..."
          erro={erroAoCarregar}
          vazio={!opcoes}
          mensagemVazio="Quiz não encontrado."
        >
          {opcoes && (
            <>
              {!editando && (
                <LimiteDeCriacao itens={quizzes} usuario={usuario} tipo="quizzes" />
              )}
              {voltaParaModeracao && (
                <p
                  role="note"
                  className="mb-6 rounded-xl border border-aviso/50 bg-aviso/10 p-4 text-sm text-amber-50"
                >
                  Ao salvar, o quiz volta para pendente e precisa ser aprovado de novo. Se ele já
                  estava no site, sai até a nova aprovação, e as aprovações que ele tinha são
                  apagadas.
                </p>
              )}
              {!criacaoBloqueada && (
                <Cartao>
                  <QuizForm
                    valoresIniciais={opcoes.valoresIniciais}
                    categorias={opcoes.categorias}
                    niveis={opcoes.niveis}
                    artigos={opcoes.artigos}
                    enviando={enviando}
                    camposComErro={camposComErro}
                    textoBotao={textoBotao}
                    textoBotaoEnviando={editando ? "Salvando..." : "Enviando..."}
                    destinoAoCancelar={destinoAoCancelar}
                    aoEnviar={salvar}
                  />
                </Cartao>
              )}
            </>
          )}
        </EstadoRequisicao>
      </div>
    </div>
  );
}

export default QuizFormPages;
