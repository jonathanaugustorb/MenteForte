import SecaoProposta from "../components/ComponentesHome/SecaoProposta";
import Container from "../components/ui/Container";
import { proposta } from "../components/ComponentesHome/dadosHome";

function HomePages() {
  return (
    <Container className="pt-20 pb-16 text-center">
      <h1 className="font-titulo text-4xl font-extrabold tracking-tight text-texto sm:text-6xl">
        Mais que músculos, <span className="text-marca-500">conhecimento</span>.
      </h1>
      <p className="mt-5 text-lg text-texto-suave">
        Treine com propósito. Estude com disciplina. Evolua com conhecimento.
      </p>

      <SecaoProposta proposta={proposta} />
    </Container>
  );
}

export default HomePages;
