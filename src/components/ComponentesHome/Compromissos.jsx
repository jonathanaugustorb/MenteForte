import Container from "../ui/Container";
import TituloDeSecao from "../ui/TituloDeSecao";
import { COMPROMISSOS } from "./dadosHome";

function Compromissos() {
  return (
    <section aria-labelledby="titulo-compromissos" className="py-20 sm:py-24">
      <Container largura="larga">
        <TituloDeSecao id="titulo-compromissos" sobretitulo="Nossos compromissos" titulo="Feito para aprender com segurança" />
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {COMPROMISSOS.map(({ icone: Icone, titulo, texto }) => (
            <li key={titulo} className="flex gap-4">
              <Icone size={24} aria-hidden="true" className="mt-0.5 shrink-0 text-marca-400" />
              <div>
                <h3 className="font-semibold text-texto">{titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-texto-suave">{texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Compromissos;
