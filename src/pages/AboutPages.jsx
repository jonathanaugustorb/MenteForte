import { Link } from "react-router-dom";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import Cartao from "../components/ui/Cartao";
import Container from "../components/ui/Container";
import { COMPROMISSOS, PERFIS } from "../components/ComponentesHome/dadosHome";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";

const ESTILO_TITULO_DA_SECAO = "font-titulo text-2xl font-bold tracking-tight text-texto";
const ESTILO_PARAGRAFO = "leading-relaxed text-texto-suave";
const ESTILO_LINK = "font-semibold text-marca-300 underline underline-offset-4 hover:text-marca-200";

function AboutPages() {
  return (
    <Container largura="estreita" className="pb-16">
      <CabecalhoPagina
        titulo="Quem somos"
        subtitulo="Uma plataforma de estudo para quem está começando na musculação e quer treinar com informação de qualidade."
        icone={ICONES_DAS_PAGINAS.quemSomos}
      />

      <div className="space-y-14">
        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_DA_SECAO}>Por que o MenteForte existe</h2>
          <p className={ESTILO_PARAGRAFO}>
            Muita gente começa a treinar sem orientação e aprende a execução dos exercícios por tentativa e
            erro. Isso aumenta o risco de lesão e reduz o resultado do treino.
          </p>
          <p className={ESTILO_PARAGRAFO}>
            O MenteForte reúne, num só lugar, conteúdo escrito e revisado por profissionais de Educação Física,
            para que você entenda o que está fazendo antes de fazer. Daí o lema: mais que músculos,
            conhecimento.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className={ESTILO_TITULO_DA_SECAO}>Como a plataforma funciona</h2>
          <p className={ESTILO_PARAGRAFO}>
            São três perfis. O conteúdo enviado por um professor passa pela revisão de outros professores e pela
            decisão do administrador antes de aparecer no site.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {PERFIS.map(({ papel, icone: Icone, titulo, texto }) => (
              <Cartao key={papel} className="space-y-3">
                <Icone size={22} aria-hidden="true" className="text-marca-400" />
                <h3 className="font-titulo text-lg font-bold text-texto">{titulo}</h3>
                <p className="text-sm leading-relaxed text-texto-suave">{texto}</p>
              </Cartao>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className={ESTILO_TITULO_DA_SECAO}>Nossos compromissos</h2>
          <ul className="space-y-4">
            {COMPROMISSOS.map(({ icone: Icone, titulo, texto }) => (
              <li key={titulo} className="flex gap-4">
                <Icone size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-marca-400" />
                <p className={ESTILO_PARAGRAFO}>
                  <strong className="text-texto">{titulo}.</strong> {texto}
                </p>
              </li>
            ))}
          </ul>
          <p className={ESTILO_PARAGRAFO}>
            Os detalhes sobre os seus dados estão na{" "}
            <Link to="/politica-de-privacidade" className={ESTILO_LINK}>
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        <section className="space-y-5">
          <h2 className={ESTILO_TITULO_DA_SECAO}>Quem desenvolveu</h2>
          <Cartao className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-marca-500 to-marca-700 font-titulo text-xl font-bold text-white shadow-marca"
            >
              JB
            </span>
            <div>
              <h3 className="font-titulo text-lg font-bold text-texto">Jonathan Augusto Rodrigues Barbosa</h3>
              <p className="mt-1 text-sm leading-relaxed text-texto-suave">
                Planejamento, design e desenvolvimento do MenteForte, da interface às regras da plataforma.
              </p>
            </div>
          </Cartao>
          <p className={ESTILO_PARAGRAFO}>
            Ficou com alguma dúvida ou quer sugerir algo?{" "}
            <Link to="/contato" className={ESTILO_LINK}>
              Fale com a gente
            </Link>
            .
          </p>
        </section>
      </div>
    </Container>
  );
}

export default AboutPages;
