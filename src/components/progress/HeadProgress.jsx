import CabecalhoPagina from "../ui/CabecalhoPagina";
import { ICONES_DAS_PAGINAS } from "../../utils/iconesDasPaginas";

function HeadProgress() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <CabecalhoPagina
        titulo="Calcule suas métricas"
        subtitulo="Digite seus números e receba o resultado na hora, cada métrica vem com o conceito explicado, para você entender o que está calculando."
        icone={ICONES_DAS_PAGINAS.calculadoras}
      />
    </div>
  );
}

export default HeadProgress;
