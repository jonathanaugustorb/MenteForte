import { delay, HttpResponse } from "msw";
import { ErroDaApi } from "./erros";
import { lerBanco, salvarBanco } from "../banco";

const LATENCIA_MS = 250;

function responderErro(erro) {
  return HttpResponse.json(
    { status: erro.status, message: erro.message, campos: erro.campos },
    { status: erro.status },
  );
}

async function lerCorpo(request) {
  if (!["POST", "PUT", "PATCH"].includes(request.method)) return null;
  const texto = await request.text();
  if (!texto) return {};
  try {
    return JSON.parse(texto);
  } catch {
    throw new ErroDaApi(400, "Corpo da requisição inválido");
  }
}

export function rota(executar) {
  return async ({ request, params }) => {
    await delay(LATENCIA_MS);
    const banco = lerBanco();
    const consulta = new URL(request.url).searchParams;

    try {
      const corpo = await lerCorpo(request);
      const resultado = await executar({ request, params, consulta, corpo, banco });
      salvarBanco(banco);
      if (resultado instanceof Response) return resultado;
      return resultado === undefined
        ? new HttpResponse(null, { status: 204 })
        : HttpResponse.json(resultado);
    } catch (erro) {
      if (!(erro instanceof ErroDaApi)) throw erro;
      salvarBanco(banco);
      return responderErro(erro);
    }
  };
}
