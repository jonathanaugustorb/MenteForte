import { X } from "lucide-react";
import CampoNumero from "./CampoNumero";
import { ESTILO_ENTRADA } from "../ui/estiloDeCampo";

function LinhaSerie({
  grade,
  linha,
  exercicios,
  carregandoExercicios,
  aoAlterar,
  aoRemover,
  podeRemover,
}) {
  return (
    <div className={grade}>
      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor={`exercicio-${linha.id}`}
          className="text-sm font-medium text-texto sm:sr-only"
        >
          Exercício
        </label>
        <select
          id={`exercicio-${linha.id}`}
          value={linha.exercicioId}
          disabled={carregandoExercicios}
          onChange={(evento) => aoAlterar("exercicioId", evento.target.value)}
          className={`${ESTILO_ENTRADA} min-w-0`}
        >
          <option value="" className="bg-fundo">
            {carregandoExercicios ? "Carregando..." : "Selecione"}
          </option>
          {exercicios.map((exercicio) => (
            <option
              key={exercicio.id}
              value={exercicio.id}
              className="bg-fundo"
            >
              {exercicio.nome}
            </option>
          ))}
        </select>
      </div>

      <CampoNumero
        id={`series-${linha.id}`}
        digitos={2}
        rotulo="Séries"
        valor={linha.series}
        aoAlterar={(valor) => aoAlterar("series", valor)}
        placeholder="4"
        classeRotulo="sm:sr-only"
      />

      <CampoNumero
        id={`reps-${linha.id}`}
        digitos={2}
        rotulo="Repetições"
        valor={linha.repeticoes}
        aoAlterar={(valor) => aoAlterar("repeticoes", valor)}
        placeholder="10"
        classeRotulo="sm:sr-only"
      />

      <CampoNumero
        id={`carga-${linha.id}`}
        digitos={3}
        casas={1}
        rotulo="Carga (kg)"
        valor={linha.cargaKg}
        aoAlterar={(valor) => aoAlterar("cargaKg", valor)}
        decimal
        placeholder="60"
        classeRotulo="sm:sr-only"
      />

      <button
        type="button"
        onClick={aoRemover}
        disabled={!podeRemover}
        aria-label="Remover exercício"
        className="self-end py-2 text-texto-suave hover:text-marca-200 cursor-pointer disabled:cursor-not-allowed disabled:text-texto-fraco"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default LinhaSerie;
