import { Link } from "react-router-dom";
import Cartao from "../ui/Cartao";

function SecaoProposta({ proposta }) {
  const { titulo, texto } = proposta;

  return (
    <section className="py-12">
      <Cartao className="bg-linear-to-br from-red-950/60 to-transparent p-8 text-center sm:p-12">
        <h2 className="font-titulo font-bold text-4xl text-white sm:text-5xl">
          {titulo}
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-gray-300 sm:text-2xl">
          {texto}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/cadastro"
            className="rounded-full bg-red-500 px-8 py-3 text-lg font-bold text-white hover:bg-red-900"
          >
            Começar agora
          </Link>
        </div>
      </Cartao>
    </section>
  );
}

export default SecaoProposta;
