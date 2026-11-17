import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DicaDoGrafico from "./DicaDoGrafico";
import { CORES_DOS_GRAFICOS } from "./coresDosGraficos";

const ALTURA = 224;

function GraficoLinha({ dados, sufixo = "", maximo }) {
  const ultimoIndice = dados.length - 1;

  function rotuloDoUltimoPonto({ x, y, value, index }) {
    if (index !== ultimoIndice) return null;

    return (
      <text x={x} y={y - 12} fill={CORES_DOS_GRAFICOS.texto} fontSize={13} textAnchor="middle">
        {`${value}${sufixo}`}
      </text>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={ALTURA}>
      <LineChart data={dados} margin={{ top: 24, right: 24, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={CORES_DOS_GRAFICOS.grade} />
        <XAxis
          dataKey="rotulo"
          tickLine={false}
          tickMargin={8}
          axisLine={{ stroke: CORES_DOS_GRAFICOS.grade }}
          tick={{ fill: CORES_DOS_GRAFICOS.texto, fontSize: 13 }}
          minTickGap={16}
        />
        <YAxis
          width={44}
          domain={[0, maximo ?? "auto"]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: CORES_DOS_GRAFICOS.texto, fontSize: 13 }}
          tickFormatter={(valor) => `${valor}${sufixo}`}
        />
        <Tooltip
          cursor={{ stroke: CORES_DOS_GRAFICOS.grade }}
          content={<DicaDoGrafico sufixo={sufixo} />}
        />
        <Line
          type="linear"
          dataKey="valor"
          stroke={CORES_DOS_GRAFICOS.dado}
          strokeWidth={2}
          dot={{ r: 5, fill: CORES_DOS_GRAFICOS.dado, stroke: CORES_DOS_GRAFICOS.fundo, strokeWidth: 2 }}
          activeDot={{ r: 7, fill: CORES_DOS_GRAFICOS.dado, stroke: CORES_DOS_GRAFICOS.fundo, strokeWidth: 2 }}
          isAnimationActive={false}
        >
          <LabelList dataKey="valor" content={rotuloDoUltimoPonto} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GraficoLinha;
