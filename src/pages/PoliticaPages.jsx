import PaginaDoDocumento from "../components/ComponentesLegais/PaginaDoDocumento";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";

function PoliticaPages() {
  return (
    <PaginaDoDocumento
      tipo="POLITICA_PRIVACIDADE"
      titulo="Política de Privacidade"
      icone={ICONES_DAS_PAGINAS.politica}
    />
  );
}

export default PoliticaPages;
