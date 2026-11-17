import Container from "../ui/Container";
import TituloDeSecao from "../ui/TituloDeSecao";
import { ETAPAS_DE_PUBLICACAO } from "./dadosHome";

function ComoFunciona() {
  return (
    <section aria-labelledby="titulo-como-funciona" className="py-20 sm:py-24">
      <Container largura="larga" className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center">
        <TituloDeSecao
          id="titulo-como-funciona"
          sobretitulo="Como o conteúdo é feito"
          titulo="Nada vai ao ar sem revisão"
          descricao="Todo conteúdo enviado por um professor passa por outros professores e pelo administrador antes de chegar até você."
        />
        <ol className="space-y-4">
          {ETAPAS_DE_PUBLICACAO.map((etapa, indice) => (
            <li key={etapa.titulo} className="flex gap-5 rounded-2xl border border-borda bg-superficie p-6 shadow-cartao">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-marca-600 font-titulo text-base font-bold text-white"
              >
                {indice + 1}
              </span>
              <div>
                <h3 className="font-titulo text-lg font-bold text-texto">{etapa.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-texto-suave">{etapa.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export default ComoFunciona;
