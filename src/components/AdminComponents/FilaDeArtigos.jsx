import { Fragment, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import EstadoRequisicao from "../ui/EstadoRequisicao";
import ArtigoNaFila from "./ArtigoNaFila";
import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import { listarArtigosPendentes } from "../../services/artigoService";
import { formatarDataCurta } from "../../utils/formatar";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-marca-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-texto-suave align-top";
const ESTILO_ETIQUETA = "rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap";

const CORES_DA_SITUACAO = {
  PENDENTE: "border-aviso/50 bg-aviso/15 text-aviso",
  APROVADO_PELOS_PROFESSORES: "border-sucesso/50 bg-emerald-600/20 text-sucesso",
};


function situacaoDoArtigo(artigo) {
  const descricao = STATUS_ARTIGO[artigo.status]?.descricao ?? artigo.status;
  return `${descricao} · ${artigo.aprovacoesDeProfessores} de ${artigo.aprovacoesNecessarias}`;
}

function FilaDeArtigos() {
  const { avisar } = useOutletContext();
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [idAberto, setIdAberto] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarArtigosPendentes()
      .then((lista) => {
        if (!ativo) return;
        setArtigos(lista);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os artigos pendentes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function alternar(id) {
    setIdAberto((atual) => (atual === id ? null : id));
  }

  function retirarDaFila(atualizado) {
    setArtigos((atuais) =>
      atuais.filter((artigo) => artigo.id !== atualizado.id),
    );
    setIdAberto(null);
    avisar({
      tipo: "sucesso",
      titulo: atualizado.status === "APROVADO" ? "Artigo aprovado" : "Artigo rejeitado",
      mensagem:
        atualizado.status === "APROVADO"
          ? `"${atualizado.titulo}" está publicado no site.`
          : `"${atualizado.titulo}" foi rejeitado, e o autor vê o motivo.`,
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
          Artigos para revisar
          {!carregando && !erro && ` (${artigos.length})`}
        </h2>
        <p className="mt-1 text-sm text-texto-fraco">
          Artigos que esperam a decisão do administrador.
        </p>
      </div>

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando artigos..."
        erro={erro}
        vazio={artigos.length === 0}
        mensagemVazio="Nenhum artigo aguardando revisão."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-borda">
                <th className={ESTILO_CABECALHO}>Artigo</th>
                <th className={ESTILO_CABECALHO}>Situação</th>
                <th className={ESTILO_CABECALHO}>Enviado em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {artigos.map((artigo) => {
                const aberto = artigo.id === idAberto;

                return (
                  <Fragment key={artigo.id}>
                    <tr className={aberto ? "" : "border-b border-borda"}>
                      <td className={`${ESTILO_CELULA} wrap-anywhere`}>
                        <span className="block text-white">{artigo.titulo}</span>
                        <span className="block text-xs text-texto-fraco">
                          por {artigo.autorNome}
                        </span>
                      </td>
                      <td className={ESTILO_CELULA}>
                        <span
                          className={`${ESTILO_ETIQUETA} ${
                            CORES_DA_SITUACAO[artigo.status] ??
                            "border-borda-forte text-texto-suave"
                          }`}
                        >
                          {situacaoDoArtigo(artigo)}
                        </span>
                      </td>
                      <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                        {formatarDataCurta(artigo.criadoEm)}
                      </td>
                      <td className={ESTILO_CELULA}>
                        <button
                          type="button"
                          aria-expanded={aberto}
                          onClick={() => alternar(artigo.id)}
                          className={estiloDeBotao({ variante: "secundario", tamanho: "pequeno" })}
                        >
                          {aberto ? "Ver −" : "Ver +"}
                        </button>
                      </td>
                    </tr>
                    {aberto && (
                      <tr className="border-b border-borda">
                        <td colSpan={4} className="pr-4 pb-6">
                          <ArtigoNaFila
                            artigo={artigo}
                            aoAlterarStatus={retirarDaFila}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>
    </section>
  );
}

export default FilaDeArtigos;