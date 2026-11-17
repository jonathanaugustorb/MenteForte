import PainelDeFiltros from "../PainelDeFiltros";
import GrupoDeChips from "../ui/GrupoDeChips";

function FilterLibrary({ grupos, grupoSelecionado, aoSelecionar }) {
  const selecionado = grupos.find((grupo) => grupo.codigo === grupoSelecionado);

  return (
    <div className="mb-8">
      <PainelDeFiltros id="grupos-musculares" rotulo="Grupos musculares" resumo={selecionado?.descricao ?? "Todos"}>
        {({ fechar }) => (
          <GrupoDeChips
            titulo="Grupo muscular"
            opcoes={grupos}
            selecionada={grupoSelecionado}
            rotuloDeTodas="Todos"
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

export default FilterLibrary;
