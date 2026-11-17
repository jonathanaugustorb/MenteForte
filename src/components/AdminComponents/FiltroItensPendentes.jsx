const FILTROS = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "artigos", rotulo: "Artigos" },
  { valor: "quizzes", rotulo: "Quizzes" },
  { valor: "exercicios", rotulo: "Exercícios" },
  { valor: "exclusoes", rotulo: "Pedidos de exclusão" },
];

const ESTILO_FILTRO = "rounded-full border px-4 py-1 text-sm cursor-pointer";

function FiltroItensPendentes({ tipo, aoMudar }) {
  return (
    <div
      role="group"
      aria-label="Filtrar itens pendentes"
      className="mb-8 flex flex-wrap gap-2"
    >
      {FILTROS.map((filtro) => {
        const ativo = filtro.valor === tipo;

        return (
          <button
            key={filtro.valor}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoMudar(filtro.valor)}
            className={`${ESTILO_FILTRO} ${
              ativo
                ? "border-marca-500 bg-marca-600/20 text-white"
                : "border-borda-forte text-texto-suave hover:bg-white/10"
            }`}
          >
            {filtro.rotulo}
          </button>
        );
      })}
    </div>
  );
}

export default FiltroItensPendentes;