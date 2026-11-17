import Cartao from "../ui/Cartao";
import CabecalhoPagina from "../ui/CabecalhoPagina";
import SecoesDoDocumento from "./SecoesDoDocumento";

function DocumentoLegal({ titulo, icone, versao, vigencia, secoes }) {
  return (
    <>
      <CabecalhoPagina
        titulo={titulo}
        subtitulo={`Versão ${versao} · em vigor desde ${vigencia}`}
        icone={icone}
      />
      <Cartao className="sm:p-10">
        <SecoesDoDocumento secoes={secoes} />
      </Cartao>
    </>
  );
}

export default DocumentoLegal;
