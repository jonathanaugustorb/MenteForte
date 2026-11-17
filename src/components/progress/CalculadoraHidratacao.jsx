import { useState } from "react";
import { calcularHidratacao } from "../../services/metricasService";
import useCalculo from "../../hooks/useCalculo";
import useConsumoAgua from "../../hooks/useConsumoAgua";
import SecaoCalculadora from "./SecaoCalculadora";
import CardResultado from "./CardResultado";
import CampoNumero from "./CampoNumero";
import BarraComposicao from "./BarraComposicao";
import BlocoExplicacao from "./BlocoExplicacao";
import EstadoRequisicao from "../ui/EstadoRequisicao";
import TrackerAgua from "./TrackerAgua";
import { EXPLICACAO_HIDRATACAO, COMO_CALCULAMOS_HIDRATACAO } from "./explicacoesCalculo";
import { formatarNumero, paraNumero } from "../../utils/formatar";
import ComoCalculamos from "./ComoCalculamos";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const EXIBIR_REGISTRO_DE_AGUA = true;

function CalculadoraHidratacao({ pesoKg, aoAlterarPeso, consentiu }) {
  const [dadosCalculados, setDadosCalculados] = useState(null); 
  const [minutosTreinoPorDia, setMinutosTreinoPorDia] = useState("");

  const { resultado, carregando, erro, executar } =
    useCalculo(calcularHidratacao);

  const {
    resumo,
    processando,
    erro: erroConsumo,
    carregar,
    registrar,
  } = useConsumoAgua();

  const formularioValido = consentiu && pesoKg && minutosTreinoPorDia !== "";

  function dadosDoDia() {
    return {
      pesoKg: paraNumero(pesoKg),
      minutosTreinoPorDia: paraNumero(minutosTreinoPorDia),
    };
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    if (!formularioValido) return;

    const dados = dadosDoDia();
    const resposta = await executar(dados);
    if (resposta) setDadosCalculados(dados);
    if (EXIBIR_REGISTRO_DE_AGUA) carregar(dados);
  }

  const seuCalculo =
    resultado && dadosCalculados
      ? [
          `Base = 35 × ${formatarNumero(dadosCalculados.pesoKg)} = ${formatarNumero(resultado.baseCorporalMl)} ml`,
          `Adicional = (${formatarNumero(dadosCalculados.minutosTreinoPorDia)} ÷ 60) × 500 = ${formatarNumero(resultado.adicionalTreinoMl)} ml`,
          `Meta = ${formatarNumero(resultado.baseCorporalMl)} + ${formatarNumero(resultado.adicionalTreinoMl)} = ${formatarNumero(resultado.mlPorDia)} ml (${formatarNumero(resultado.litrosPorDia)} litros)`,
        ]
      : null;

  function aoRegistrarConsumo(quantidadeMl) {
    registrar(dadosDoDia(), quantidadeMl);
  }

  const blocoResultado = (
    <div className="flex flex-col gap-6">
      <EstadoRequisicao
        carregando={carregando}
        erro={erro}
        vazio={!resultado}
        mensagemVazio="Informe seu peso e o tempo de treino ao lado para ver sua meta."
      >
        {resultado ? (
          <div className="flex flex-col gap-6">
            <CardResultado
              rotulo="Sua meta diária"
              valor={resultado.litrosPorDia}
              unidade="litros"
              rodape={`${formatarNumero(resultado.mlPorDia)} ml por dia`}
            />

            <BarraComposicao
              titulo="Composição da meta"
              total={resultado.mlPorDia}
              segmentos={[
                {
                  rotulo: "Base corporal (peso)",
                  valor: resultado.baseCorporalMl,
                  texto: `${formatarNumero(resultado.baseCorporalMl)} ml`,
                  cor: "bg-marca-600",
                },
                {
                  rotulo: "Adicional de treino",
                  valor: resultado.adicionalTreinoMl,
                  texto: `${formatarNumero(resultado.adicionalTreinoMl)} ml`,
                  cor: "bg-marca-200",
                },
              ]}
            />

            <BlocoExplicacao texto={EXPLICACAO_HIDRATACAO} />
          </div>
        ) : null}
      </EstadoRequisicao>

      {EXIBIR_REGISTRO_DE_AGUA && resumo ? (
        <CardResultado
          rotulo="Água consumida hoje"
          valor={resumo.totalConsumidoMl}
          unidade="ml"
          variante="neutro"
          rodape={`Faltam ${formatarNumero(resumo.restanteMl)} ml para a meta de ${formatarNumero(resumo.metaMl)} ml.`}
        />
      ) : null}
    </div>
  );

  return (
    <SecaoCalculadora
      numero="03"
      titulo="Meta de hidratação"
      conceito={
        <>
          <span className="font-semibold text-white">O que é a meta? </span>É
          quanta água seu corpo precisa em um dia: uma parte vem do seu peso
          corporal e outra do tempo que você treina. Água regula a temperatura,
          transporta nutrientes e sustenta a contração muscular treinar
          desidratado custa força.
        </>
      }
      resultado={blocoResultado}
      comoCalculamos={
        <ComoCalculamos {...COMO_CALCULAMOS_HIDRATACAO} seuCalculo={seuCalculo} />
      }
    >
      <div className="flex flex-col gap-6">
        <form
          onSubmit={aoEnviar}
          className="flex flex-col gap-6 p-7 border bg-superficie border-borda rounded-xl shadow-cartao"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-marca-600"></span>
            <span className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
              Seu dia de treino
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <CampoNumero
                id="peso-hidratacao"
                digitos={3}
                casas={2}
                rotulo="Peso (kg)"
                valor={pesoKg}
                aoAlterar={aoAlterarPeso}
                decimal
                placeholder="82,5"
              />
              <span className="text-xs text-texto-suave">
                É o mesmo peso da calculadora de TMB.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <CampoNumero
                id="minutos-treino"
                digitos={3}
                rotulo="Treino por dia (min)"
                valor={minutosTreinoPorDia}
                aoAlterar={setMinutosTreinoPorDia}
                placeholder="60"
              />
              <span className="text-xs text-texto-suave">
                Use 0 se for dia de descanso.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!formularioValido || carregando}
            className={estiloDeBotao({ className: "self-start" })}
          >
            {carregando ? "Calculando..." : "Calcular"}
          </button>
        </form>
      {EXIBIR_REGISTRO_DE_AGUA && (
        <TrackerAgua
          habilitado={Boolean(formularioValido && resultado)}
          resumo={resumo}
          processando={processando}
          erro={erroConsumo}
          aoRegistrar={aoRegistrarConsumo}
        />
      )}
      </div>
    </SecaoCalculadora>
  );
}

export default CalculadoraHidratacao;
