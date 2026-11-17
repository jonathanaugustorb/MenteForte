import PainelDeFiltros from "../PainelDeFiltros";
import CampoDeBusca from "../ui/CampoDeBusca";
import GrupoDeChips from "../ui/GrupoDeChips";

function descricaoDe(opcoes, codigo) {
  if (!codigo) return null;
  return opcoes.find((opcao) => opcao.codigo === codigo)?.descricao ?? null;
}

function FiltroQuizzes({
  busca,
  aoBuscar,
  categorias,
  categoriaSelecionada,
  aoSelecionarCategoria,
  niveis,
  nivelSelecionado,
  aoSelecionarNivel,
}) {
  const escolhas = [descricaoDe(categorias, categoriaSelecionada), descricaoDe(niveis, nivelSelecionado)].filter(
    Boolean,
  );

  return (
    <div className="mb-8 space-y-4">
      <CampoDeBusca valor={busca} aoAlterar={aoBuscar} rotulo="Buscar quiz por título" placeholder="Buscar por título" />
      <PainelDeFiltros
        id="filtros-dos-quizzes"
        rotulo="Categoria e nível"
        resumo={escolhas.length ? escolhas.join(" · ") : "Todos"}
      >
        <GrupoDeChips
          titulo="Categoria"
          opcoes={categorias}
          selecionada={categoriaSelecionada}
          aoSelecionar={aoSelecionarCategoria}
        />
        <GrupoDeChips
          titulo="Nível"
          opcoes={niveis}
          selecionada={nivelSelecionado}
          aoSelecionar={aoSelecionarNivel}
          rotuloDeTodas="Todos"
        />
      </PainelDeFiltros>
    </div>
  );
}

export default FiltroQuizzes;
