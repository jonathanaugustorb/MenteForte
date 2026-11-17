import { Link } from "react-router-dom";
import Container from "../ui/Container";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function ChamadaFinal() {
  return (
    <section aria-labelledby="titulo-chamada-final" className="pb-24">
      <Container largura="larga">
        <div className="relative overflow-hidden rounded-3xl border border-marca-500/30 bg-linear-to-br from-marca-900/60 via-superficie to-superficie px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-marca-600/25 blur-3xl"
          />
          <h2
            id="titulo-chamada-final"
            className="relative font-titulo text-3xl font-extrabold tracking-tight text-texto sm:text-4xl"
          >
            Pronto para treinar com informação?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-texto-suave">
            Crie sua conta em menos de um minuto e comece pelos artigos e pela biblioteca de exercícios.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 xs:flex-row">
            <Link to="/cadastro" className={estiloDeBotao({ tamanho: "grande" })}>
              Criar conta grátis
            </Link>
            <Link to="/about" className={estiloDeBotao({ variante: "secundario", tamanho: "grande" })}>
              Conhecer o projeto
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ChamadaFinal;
