import { useEffect, useState } from "react";
import DocumentoLegal from "./DocumentoLegal";
import Container from "../ui/Container";
import EstadoRequisicao from "../ui/EstadoRequisicao";
import { buscarDocumento } from "../../services/documentoLegalService";
import { formatarDataExtenso } from "../../utils/formatar";

function PaginaDoDocumento({ tipo, titulo, icone }) {
  const [documento, setDocumento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    buscarDocumento(tipo)
      .then((dados) => {
        if (ativo) setDocumento(dados);
      })
      .catch((falha) => {
        if (ativo) setErro(falha.mensagem || `Não foi possível carregar: ${titulo}.`);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [tipo, titulo]);

  return (
    <Container largura="estreita" className="pb-16">
      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando documento..."
        erro={erro}
        vazio={!documento}
        mensagemVazio="Documento não encontrado."
      >
        {documento && (
          <DocumentoLegal
            titulo={titulo}
            icone={icone}
            versao={documento.versao}
            vigencia={formatarDataExtenso(documento.vigenteDesde)}
            secoes={documento.secoes}
          />
        )}
      </EstadoRequisicao>
    </Container>
  );
}

export default PaginaDoDocumento;
