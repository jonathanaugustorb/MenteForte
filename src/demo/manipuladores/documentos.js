import { http } from "msw";
import { rota } from "../apoio/rota";
import { naoEncontrado } from "../apoio/erros";
import { DOCUMENTOS } from "../dados/documentos";

export const manipuladoresDeDocumentos = [
  http.get(
    "/api/documentos-legais",
    rota(() => DOCUMENTOS),
  ),
  http.get(
    "/api/documentos-legais/:tipo",
    rota(({ params }) => {
      const documento = DOCUMENTOS.find((candidato) => candidato.tipo === params.tipo);
      if (!documento) throw naoEncontrado("Documento não encontrado");
      return documento;
    }),
  ),
];
