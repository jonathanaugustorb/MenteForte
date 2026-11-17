import Cartao from "../ui/Cartao";
import Container from "../ui/Container";
import IconeDaPagina from "../ui/IconeDaPagina";
import TituloDeSecao from "../ui/TituloDeSecao";
import { RECURSOS } from "./dadosHome";

function Recursos() {
  return (
    <section aria-labelledby="titulo-recursos" className="border-t border-borda bg-superficie/30 py-20 sm:py-24">
      <Container largura="larga">
        <TituloDeSecao
          id="titulo-recursos"
          sobretitulo="O que você encontra"
          titulo="Tudo para treinar entendendo o que faz"
          descricao="Quatro áreas que se completam: você estuda, confere a técnica, testa o que aprendeu e acompanha os números."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RECURSOS.map((recurso) => (
            <Cartao key={recurso.titulo} className="flex flex-col gap-4">
              <IconeDaPagina icone={recurso.icone} />
              <h3 className="font-titulo text-lg font-bold text-texto">{recurso.titulo}</h3>
              <p className="text-sm leading-relaxed text-texto-suave">{recurso.texto}</p>
            </Cartao>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Recursos;
