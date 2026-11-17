import { estiloDeChip } from "./estiloDeChip";

function GrupoDeChips({ titulo, opcoes, selecionada, aoSelecionar, rotuloDeTodas = "Todas" }) {
  return (
    <div role="group" aria-label={titulo} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 hidden text-sm font-medium text-texto-fraco md:inline">{titulo}</span>
      <button
        type="button"
        aria-pressed={selecionada === ""}
        onClick={() => aoSelecionar("")}
        className={estiloDeChip(selecionada === "")}
      >
        {rotuloDeTodas}
      </button>
      {opcoes.map((opcao) => (
        <button
          key={opcao.codigo}
          type="button"
          aria-pressed={selecionada === opcao.codigo}
          onClick={() => aoSelecionar(opcao.codigo)}
          className={estiloDeChip(selecionada === opcao.codigo)}
        >
          {opcao.descricao}
        </button>
      ))}
    </div>
  );
}

export default GrupoDeChips;
