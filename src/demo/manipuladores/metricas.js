import { http } from "msw";
import { rota } from "../apoio/rota";
import { naoEncontrado } from "../apoio/erros";
import { usuarioAutenticado } from "../apoio/acesso";
import { GRUPOS_MUSCULARES, listarOpcoes, NIVEIS_DE_ATIVIDADE, SEXOS } from "../apoio/opcoes";
import { criarValidacao } from "../apoio/validacao";
import { PUBLICADOS } from "../apoio/moderacao";

const FORMULA_TMB = "Mifflin-St Jeor";

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

function numero(valor) {
  return typeof valor === "number" && Number.isFinite(valor);
}

function inteiro(valor) {
  return Number.isInteger(valor);
}

function entre(valor, minimo, maximo) {
  return numero(valor) && valor >= minimo && valor <= maximo;
}

function validarPesoEMinutos(validacao, corpo) {
  return validacao
    .exigir(numero(corpo.pesoKg), "pesoKg", "Informe o peso")
    .exigir(!numero(corpo.pesoKg) || entre(corpo.pesoKg, 20, 300), "pesoKg", "O peso deve ser de 20 a 300 kg")
    .exigir(inteiro(corpo.minutosTreinoPorDia), "minutosTreinoPorDia", "Informe os minutos de treino por dia")
    .exigir(
      !inteiro(corpo.minutosTreinoPorDia) || entre(corpo.minutosTreinoPorDia, 0, 480),
      "minutosTreinoPorDia",
      "Os minutos de treino devem ser de 0 a 480",
    );
}

function calcularHidratacao(pesoKg, minutosTreinoPorDia) {
  const baseCorporalMl = Math.round(35 * pesoKg);
  const adicionalTreinoMl = Math.round((minutosTreinoPorDia / 60) * 500);
  const mlPorDia = baseCorporalMl + adicionalTreinoMl;
  return { mlPorDia, litrosPorDia: arredondar(mlPorDia / 1000), baseCorporalMl, adicionalTreinoMl };
}

function validarSeries(series) {
  const validacao = criarValidacao().exigir(
    Array.isArray(series) && series.length > 0,
    "series",
    "Informe ao menos uma série",
  );
  (Array.isArray(series) ? series : []).forEach((serie, indice) => {
    const prefixo = `series[${indice}]`;
    validacao
      .exigir(typeof serie?.exercicioId === "string", `${prefixo}.exercicioId`, "Informe o exercício")
      .exigir(inteiro(serie?.series) && serie.series > 0, `${prefixo}.series`, "A quantidade de séries deve ser maior que zero")
      .exigir(inteiro(serie?.repeticoes) && serie.repeticoes > 0, `${prefixo}.repeticoes`, "A quantidade de repetições deve ser maior que zero")
      .exigir(numero(serie?.cargaKg) && serie.cargaKg >= 0, `${prefixo}.cargaKg`, "A carga não pode ser negativa");
  });
  validacao.concluir();
}

export const manipuladoresDeMetricas = [
  http.get(
    "/api/metricas/niveis-atividade",
    rota(({ request, banco }) => {
      usuarioAutenticado(request, banco);
      return listarOpcoes(NIVEIS_DE_ATIVIDADE);
    }),
  ),

  http.get(
    "/api/metricas/sexos",
    rota(({ request, banco }) => {
      usuarioAutenticado(request, banco);
      return listarOpcoes(SEXOS);
    }),
  ),

  http.post(
    "/api/metricas/gasto-energetico",
    rota(({ request, corpo, banco }) => {
      usuarioAutenticado(request, banco);
      criarValidacao()
        .exigir(numero(corpo.pesoKg), "pesoKg", "Informe o peso")
        .exigir(!numero(corpo.pesoKg) || entre(corpo.pesoKg, 20, 300), "pesoKg", "O peso deve ser de 20 a 300 kg")
        .exigir(inteiro(corpo.alturaCm), "alturaCm", "Informe a altura")
        .exigir(!inteiro(corpo.alturaCm) || entre(corpo.alturaCm, 100, 250), "alturaCm", "A altura deve ser de 100 a 250 cm")
        .exigir(inteiro(corpo.idade), "idade", "Informe a idade")
        .exigir(!inteiro(corpo.idade) || corpo.idade >= 18, "idade", "A fórmula vale para adultos, a partir de 18 anos")
        .exigir(!inteiro(corpo.idade) || corpo.idade <= 120, "idade", "A idade deve ser de no máximo 120 anos")
        .exigir(Object.hasOwn(SEXOS, corpo.sexoBiologico ?? ""), "sexoBiologico", "Informe o sexo biológico")
        .exigir(
          Object.hasOwn(NIVEIS_DE_ATIVIDADE, corpo.nivelAtividade ?? ""),
          "nivelAtividade",
          "Informe o nível de atividade física",
        )
        .concluir();

      const base = 10 * corpo.pesoKg + 6.25 * corpo.alturaCm - 5 * corpo.idade;
      const tmb = corpo.sexoBiologico === "FEMININO" ? base - 161 : base + 5;
      const fator = NIVEIS_DE_ATIVIDADE[corpo.nivelAtividade].fator;

      return {
        tmb: Math.round(tmb),
        gastoEnergeticoTotal: Math.round(tmb * fator),
        fatorAtividadeAplicado: fator,
        formulaUtilizada: FORMULA_TMB,
      };
    }),
  ),

  http.post(
    "/api/metricas/hidratacao",
    rota(({ request, corpo, banco }) => {
      usuarioAutenticado(request, banco);
      validarPesoEMinutos(criarValidacao(), corpo).concluir();
      return calcularHidratacao(corpo.pesoKg, corpo.minutosTreinoPorDia);
    }),
  ),

  http.post(
    "/api/metricas/hidratacao/consumo",
    rota(({ request, corpo, banco }) => {
      usuarioAutenticado(request, banco);
      const quantidadeMl = corpo.quantidadeMl ?? 0;
      validarPesoEMinutos(criarValidacao(), corpo)
        .exigir(
          inteiro(corpo.totalConsumidoMl) && entre(corpo.totalConsumidoMl, 0, 20000),
          "totalConsumidoMl",
          "O total consumido no dia deve ser de 0 a 20000 ml",
        )
        .exigir(inteiro(quantidadeMl) && entre(quantidadeMl, 0, 5000), "quantidadeMl", "A quantidade de um registro deve ser de 0 a 5000 ml")
        .concluir();

      const metaMl = calcularHidratacao(corpo.pesoKg, corpo.minutosTreinoPorDia).mlPorDia;
      const totalConsumidoMl = corpo.totalConsumidoMl + quantidadeMl;
      return {
        metaMl,
        totalConsumidoMl,
        restanteMl: Math.max(0, metaMl - totalConsumidoMl),
        percentualDaMeta: Math.round((totalConsumidoMl * 100) / metaMl),
      };
    }),
  ),

  http.post(
    "/api/metricas/volume-treino",
    rota(({ request, corpo, banco }) => {
      usuarioAutenticado(request, banco);
      validarSeries(corpo.series);

      const exercicios = new Map(
        banco.exercicios
          .filter((exercicio) => PUBLICADOS.includes(exercicio.status))
          .map((exercicio) => [exercicio.id, exercicio]),
      );
      if (!corpo.series.every((serie) => exercicios.has(serie.exercicioId))) {
        throw naoEncontrado("Algum exercício informado não existe");
      }

      let volumeTotalKg = 0;
      let totalSeries = 0;
      let totalRepeticoes = 0;
      const volumePorGrupo = new Map();

      corpo.series.forEach((serie) => {
        const volume = serie.series * serie.repeticoes * serie.cargaKg;
        const grupo = exercicios.get(serie.exercicioId).grupoMuscular;
        volumeTotalKg += volume;
        totalSeries += serie.series;
        totalRepeticoes += serie.series * serie.repeticoes;
        volumePorGrupo.set(grupo, (volumePorGrupo.get(grupo) ?? 0) + volume);
      });

      return {
        volumeTotalKg: arredondar(volumeTotalKg),
        volumePorGrupoMuscular: [...volumePorGrupo].map(([grupoMuscular, volumeKg]) => ({
          grupoMuscular,
          descricao: GRUPOS_MUSCULARES[grupoMuscular],
          volumeKg: arredondar(volumeKg),
        })),
        totalSeries,
        totalRepeticoes,
        intensidadeMediaKgPorRep: totalRepeticoes > 0 ? Math.round(volumeTotalKg / totalRepeticoes) : 0,
      };
    }),
  ),
];
