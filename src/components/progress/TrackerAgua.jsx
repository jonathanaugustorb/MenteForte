import { useState } from "react";
import { formatarNumero } from "../../utils/formatar";
import CampoNumero from "./CampoNumero";
import BarraProgresso from "./BarraProgresso";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const ATALHOS = [250, 500, 1000];

function TrackerAgua({ habilitado, resumo, processando, erro, aoRegistrar }) {
  const [quantidadeMl, setQuantidadeMl] = useState("");

  function aoEnviar(evento) {
    evento.preventDefault();
    if (!habilitado || !quantidadeMl) return;

    aoRegistrar(Number(quantidadeMl));
    setQuantidadeMl("");
  }

  return (
    <div className="flex flex-col gap-6 p-7 border bg-superficie border-borda rounded-xl shadow-cartao">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-marca-600"></span>
        <span className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
          QUANTO VOCÊ JÁ BEBEU?
        </span>
      </div>

      {habilitado ? null : (
        <p className="text-sm text-texto-suave">
          Calcule sua meta ao lado para começar a registrar o que você bebeu.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {ATALHOS.map((valor) => (
          <button
            key={valor}
            type="button"
            disabled={!habilitado || processando}
            onClick={() => aoRegistrar(valor)}
            className="text-marca-200 border border-borda-forte p-2 rounded-md hover:bg-marca-600 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:border-borda disabled:text-texto-fraco disabled:hover:bg-transparent disabled:hover:text-texto-fraco"
          >
            + {formatarNumero(valor)} ml
          </button>
        ))}
      </div>

      <form onSubmit={aoEnviar} className="flex flex-wrap items-end gap-3">
        <div className="grow">
          <CampoNumero
            id="quantidade-agua"
            digitos={4}
            rotulo="Outra quantidade (ml)"
            valor={quantidadeMl}
            aoAlterar={setQuantidadeMl}
            placeholder="350"
          />
        </div>
        <button
          type="submit"
          disabled={!habilitado || !quantidadeMl || processando}
          className={estiloDeBotao()}
        >
          {processando ? "Registrando..." : "Registrar"}
        </button>
      </form>

      {erro ? (
        <p className="rounded-xl border border-perigo/30 bg-perigo/10 p-3 text-sm text-red-100">
          {erro}
        </p>
      ) : null}

      {resumo ? (
        <BarraProgresso
          rotulo={`${formatarNumero(resumo.totalConsumidoMl)} ml de ${formatarNumero(resumo.metaMl)} ml`}
          percentual={resumo.percentualDaMeta}
          mensagem={
            resumo.restanteMl > 0
              ? `Faltam ${formatarNumero(resumo.restanteMl)} ml para a meta de hoje.`
              : "Meta de hoje alcançada."
          }
        />
      ) : null}
    </div>
  );
}

export default TrackerAgua;
