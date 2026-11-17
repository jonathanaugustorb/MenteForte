import PainelDeFiltros from "../PainelDeFiltros";
import CampoDeBusca from "../ui/CampoDeBusca";
import GrupoDeChips from "../ui/GrupoDeChips";

function FilterArticles({ categorias, categoriaSelecionada, aoSelecionar, busca, aoBuscar }) {
  const selecionada = categorias.find((categoria) => categoria.codigo === categoriaSelecionada);

  return (
    <div className="mb-8 space-y-4">
      <CampoDeBusca
        valor={busca}
        aoAlterar={aoBuscar}
        rotulo="Buscar artigo por título"
        placeholder="Buscar por título"
      />
      <PainelDeFiltros id="categorias-dos-artigos" rotulo="Categorias" resumo={selecionada?.descricao ?? "Todas"}>
        {({ fechar }) => (
          <GrupoDeChips
            titulo="Categoria"
            opcoes={categorias}
            selecionada={categoriaSelecionada}
            aoSelecionar={(codigo) => {
              aoSelecionar(codigo);
              fechar();
            }}
          />
        )}
      </PainelDeFiltros>
    </div>
  );
}

export default FilterArticles;
