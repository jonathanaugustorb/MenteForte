import { Link } from "react-router-dom";
import Logo from "../components/ui/Logo";
import Container from "../components/ui/Container";

const GRUPOS = [
  {
    titulo: "Plataforma",
    links: [
      { para: "/about", rotulo: "Quem somos" },
      { para: "/contato", rotulo: "Contato" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { para: "/termos-de-uso", rotulo: "Termos de Uso" },
      { para: "/politica-de-privacidade", rotulo: "Política de Privacidade" },
    ],
  },
];

function Rodape() {
  return (
    <footer className="border-t border-borda bg-superficie/40">
      <Container
        largura="larga"
        className="grid gap-10 py-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
      >
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-texto-suave">
            Mais que músculos, conhecimento. Conteúdo sobre musculação revisado por profissionais
            de Educação Física, de uso gratuito.
          </p>
        </div>

        {GRUPOS.map((grupo) => (
          <nav key={grupo.titulo} aria-label={grupo.titulo}>
            <h2 className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
              {grupo.titulo}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {grupo.links.map((link) => (
                <li key={link.para}>
                  <Link to={link.para} className="text-texto-suave hover:text-texto">
                    {link.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-borda">
        <Container
          largura="larga"
          className="flex flex-col gap-2 py-6 text-xs text-texto-fraco md:flex-row md:items-center md:justify-between"
        >
          <p>&copy; 2026 MenteForte.</p>
          <p>Conteúdo educativo: não substitui a avaliação de um profissional de Educação Física ou de saúde.</p>
        </Container>
      </div>
    </footer>
  );
}

export default Rodape;
