import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import { estiloDeBotao } from "../components/ui/estiloDeBotao";
import EstadoRequisicao from "../components/ui/EstadoRequisicao";
import FiltroQuizzes from "../components/QuizComponents/FiltroQuizzes";
import CardQuiz from "../components/QuizComponents/CardQuiz";
import LimiteDeCriacao from "../components/LimiteDeCriacao";
import FiltroParaAprovar from "../components/FiltroParaAprovar";
import { listarCategorias } from "../services/artigoService";
import { listarNiveisDoQuiz, listarQuizzes } from "../services/quizService";
import { podeEditar } from "../utils/papeis";
import { limiteDeCriacao } from "../utils/limiteCriacao";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import { subtituloPorPapel } from "../utils/subtitulosDasPaginas";

function QuizzesPages() {
  const { usuario } = useOutletContext();
  const podeCriar = podeEditar(usuario);
  const [quizzes, setQuizzes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [nivelSelecionado, setNivelSelecionado] = useState("");
  const [busca, setBusca] = useState("");
  const [soParaAprovar, setSoParaAprovar] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const { bloqueado } = limiteDeCriacao(quizzes, usuario);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarQuizzes(), listarCategorias(), listarNiveisDoQuiz()])
      .then(([lista, listaCategorias, listaNiveis]) => {
        if (!ativo) return;
        setQuizzes(lista);
        setCategorias(listaCategorias);
        setNiveis(listaNiveis);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os quizzes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario]);

  const buscaNormalizada = busca.trim().toLowerCase();
  const quizzesVisiveis = quizzes.filter((quiz) => {
    const daCategoria =
      !categoriaSelecionada || quiz.categoria.codigo === categoriaSelecionada;
    const doNivel = !nivelSelecionado || quiz.nivel.codigo === nivelSelecionado;
    const doTitulo =
      !buscaNormalizada || quiz.titulo.toLowerCase().includes(buscaNormalizada);
    const paraAprovar = !soParaAprovar || quiz.podeAprovar;
    return daCategoria && doNivel && doTitulo && paraAprovar;
  });

  const aguardandoMinhaAprovacao = quizzes.filter((quiz) => quiz.podeAprovar).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
      <CabecalhoPagina
        titulo="Teste o que você aprendeu"
        subtitulo={subtituloPorPapel("quiz", usuario?.papel)}
        icone={ICONES_DAS_PAGINAS.quiz}
      >
        {podeCriar &&
          (carregando || erro || bloqueado ? (
            <button type="button" disabled className={estiloDeBotao()}>
              <Plus size={16} aria-hidden="true" />
              Novo quiz
            </button>
          ) : (
            <Link to="/quiz/novo" className={estiloDeBotao()}>
              <Plus size={16} aria-hidden="true" />
              Novo quiz
            </Link>
          ))}
      </CabecalhoPagina>

      {podeCriar && !carregando && !erro && (
        <LimiteDeCriacao itens={quizzes} usuario={usuario} tipo="quizzes" />
      )}

      {usuario?.papel === "PROFESSOR" && (
        <FiltroParaAprovar
          ativo={soParaAprovar}
          aoAlternar={setSoParaAprovar}
          quantidade={aguardandoMinhaAprovacao}
        />
      )}

      <FiltroQuizzes
        busca={busca}
        aoBuscar={setBusca}
        categorias={categorias}
        categoriaSelecionada={categoriaSelecionada}
        aoSelecionarCategoria={setCategoriaSelecionada}
        niveis={niveis}
        nivelSelecionado={nivelSelecionado}
        aoSelecionarNivel={setNivelSelecionado}
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando quizzes..."
        erro={erro}
        vazio={quizzesVisiveis.length === 0}
        mensagemVazio={
          soParaAprovar
            ? "Nenhum quiz esperando a sua aprovação."
            : "Nenhum quiz encontrado."
        }
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {quizzesVisiveis.map((quiz) => (
            <CardQuiz key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </EstadoRequisicao>
    </div>
  );
}

export default QuizzesPages;
