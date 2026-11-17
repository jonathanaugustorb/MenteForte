import { Link, useOutletContext } from "react-router-dom";
import { CircleCheck, LogIn } from "lucide-react";
import Botao from "../ui/Botao";
import Container from "../ui/Container";
import Etiqueta from "../ui/Etiqueta";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const FOTOS = [
  { src: "/images/agachamento-livre.webp", alt: "Pessoa fazendo agachamento livre com barra", classe: "row-span-2" },
  { src: "/images/crossover.webp", alt: "Pessoa fazendo crucifixo no cross-over", classe: "" },
  { src: "/images/desenvolvimento-lateral.webp", alt: "Pessoa fazendo elevação lateral sentada com halteres", classe: "" },
];

function Apresentacao() {
  const { pedirLogin } = useOutletContext();

  return (
    <section aria-labelledby="titulo-da-home" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-48 h-[40rem] bg-[radial-gradient(ellipse_at_top,rgb(223_16_40/0.22),transparent_65%)]"
      />
      <Container largura="larga" className="relative grid items-center gap-12 pt-16 pb-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pt-24 lg:pb-28">
        <div>
          <Etiqueta tom="marca">Musculação com base em estudos</Etiqueta>
          <h1
            id="titulo-da-home"
            className="mt-6 font-titulo text-4xl font-extrabold tracking-tight text-texto sm:text-5xl xl:text-6xl"
          >
            Mais que músculos, <span className="text-marca-500">conhecimento</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-texto-suave">
            O MenteForte reúne artigos revisados por profissionais de Educação Física, uma biblioteca de
            exercícios com a técnica de execução, quizzes e calculadoras de treino, para quem está começando
            na musculação.
          </p>

          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <Link to="/cadastro" className={estiloDeBotao({ tamanho: "grande" })}>
              Criar conta grátis
            </Link>
            <Botao variante="secundario" tamanho="grande" onClick={() => pedirLogin()}>
              <LogIn size={18} aria-hidden="true" />
              Entrar com conta de teste
            </Botao>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-texto-fraco">
            <CircleCheck size={16} aria-hidden="true" className="shrink-0 text-sucesso" />
            Versão de demonstração: os dados ficam só no seu navegador.
          </p>
        </div>

        <div className="relative">
          <div className="grid h-[26rem] grid-cols-2 grid-rows-2 gap-4 sm:h-[32rem]">
            {FOTOS.map((foto) => (
              <img
                key={foto.src}
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                className={`h-full w-full rounded-2xl border border-borda object-cover shadow-cartao ${foto.classe}`}
              />
            ))}
          </div>
          <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-xl border border-borda bg-superficie-alta/95 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur sm:left-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-sucesso/15 text-sucesso">
              <CircleCheck size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-texto">Revisado por professores</p>
              <p className="text-xs text-texto-fraco">3 aprovações antes de publicar</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Apresentacao;
