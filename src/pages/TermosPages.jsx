import PaginaDoDocumento from "../components/ComponentesLegais/PaginaDoDocumento";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";

function TermosPages() {
  return <PaginaDoDocumento tipo="TERMOS_USO" titulo="Termos de Uso" icone={ICONES_DAS_PAGINAS.termos} />;
}

export default TermosPages;
