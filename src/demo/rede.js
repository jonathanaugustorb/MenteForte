import { defineNetwork, InterceptorSource } from "msw/experimental";
import { FetchInterceptor } from "@mswjs/interceptors/fetch";
import { XMLHttpRequestInterceptor } from "@mswjs/interceptors/XMLHttpRequest";
import { manipuladoresDeAutenticacao } from "./manipuladores/autenticacao";
import { manipuladoresDeUsuarios } from "./manipuladores/usuarios";
import { manipuladoresDeDocumentos } from "./manipuladores/documentos";
import { manipuladoresDeArtigos } from "./manipuladores/artigos";
import { manipuladoresDeQuizzes } from "./manipuladores/quizzes";
import { manipuladoresDeExercicios } from "./manipuladores/exercicios";
import { manipuladoresDeMetricas } from "./manipuladores/metricas";
import { manipuladoresDeAuditoria } from "./manipuladores/auditoria";
import { manipuladoresDeEstatisticas } from "./manipuladores/estatisticas";

export const redeSimulada = defineNetwork({
  sources: [
    new InterceptorSource({
      interceptors: [new XMLHttpRequestInterceptor(), new FetchInterceptor()],
    }),
  ],
  handlers: [
    ...manipuladoresDeAutenticacao,
    ...manipuladoresDeUsuarios,
    ...manipuladoresDeDocumentos,
    ...manipuladoresDeArtigos,
    ...manipuladoresDeQuizzes,
    ...manipuladoresDeExercicios,
    ...manipuladoresDeMetricas,
    ...manipuladoresDeAuditoria,
    ...manipuladoresDeEstatisticas,
  ],
  onUnhandledFrame: "bypass",
});
