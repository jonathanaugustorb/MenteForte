import { useState } from "react";
import Alerta from "../ui/Alerta";
import Botao from "../ui/Botao";
import Modal from "../ui/Modal";
import SecoesDoDocumento from "../ComponentesLegais/SecoesDoDocumento";
import { formatarDataExtenso } from "../../utils/formatar";

const DOCUMENTOS = [
  { tipo: "TERMOS_USO", chave: "termos", rotulo: "Termos de Uso", artigo: "os", precisaAbrir: true },
  { tipo: "POLITICA_PRIVACIDADE", chave: "politica", rotulo: "Política de Privacidade", artigo: "a", precisaAbrir: false },
];

function AceiteDosDocumentos({ documentos, erro, aceites, aoAlterar }) {
  const [abertos, setAbertos] = useState({ termos: false, politica: false });
  const [emLeitura, setEmLeitura] = useState(null);

  const documentoEmLeitura = documentos?.find((documento) => documento.tipo === emLeitura?.tipo);

  function abrir(item) {
    setEmLeitura(item);
    setAbertos((anteriores) => ({ ...anteriores, [item.chave]: true }));
  }

  function aceitarEFechar() {
    aoAlterar((anteriores) => ({ ...anteriores, [emLeitura.chave]: true }));
    setEmLeitura(null);
  }

  if (erro) return <Alerta tipo="erro">{erro}</Alerta>;

  return (
    <section className="space-y-3 rounded-xl border border-borda bg-fundo/40 p-4 sm:p-5">
      {DOCUMENTOS.map((item) => {
        const bloqueado = item.precisaAbrir && !abertos[item.chave];
        const idDaDica = `dica-${item.chave}`;
        return (
          <div key={item.tipo}>
            <div className="flex items-start gap-3">
              <input
                id={`aceite-${item.chave}`}
                type="checkbox"
                checked={aceites[item.chave]}
                disabled={!documentos || bloqueado}
                onChange={(evento) =>
                  aoAlterar((anteriores) => ({ ...anteriores, [item.chave]: evento.target.checked }))
                }
                aria-label={`Li e aceito ${item.artigo} ${item.rotulo}`}
                aria-describedby={bloqueado ? idDaDica : undefined}
                className="mt-0.5 size-4 shrink-0 accent-marca-600 disabled:cursor-not-allowed"
              />
              <label htmlFor={`aceite-${item.chave}`} className="text-sm text-texto-suave">
                Li e aceito {item.artigo}{" "}
                <button
                  type="button"
                  onClick={() => abrir(item)}
                  disabled={!documentos}
                  className="font-semibold text-marca-300 underline underline-offset-2 hover:text-marca-200 cursor-pointer disabled:cursor-wait"
                >
                  {item.rotulo}
                </button>
              </label>
            </div>
            {bloqueado && (
              <p id={idDaDica} className="mt-1 pl-7 text-xs text-aviso">
                Abra os Termos de Uso para liberar o aceite.
              </p>
            )}
          </div>
        );
      })}

      <Modal aberto={Boolean(documentoEmLeitura)} aoFechar={() => setEmLeitura(null)} largura="larga">
        {documentoEmLeitura && (
          <div className="space-y-6">
            <div>
              <h2 className="font-titulo text-2xl font-bold text-texto">{documentoEmLeitura.descricaoTipo}</h2>
              <p className="mt-1 text-sm text-texto-fraco">
                Versão {documentoEmLeitura.versao} · em vigor desde{" "}
                {formatarDataExtenso(documentoEmLeitura.vigenteDesde)}
              </p>
            </div>
            <SecoesDoDocumento secoes={documentoEmLeitura.secoes} />
            <div className="flex flex-wrap justify-end gap-3 border-t border-borda pt-5">
              <Botao variante="secundario" onClick={() => setEmLeitura(null)}>
                Fechar
              </Botao>
              <Botao onClick={aceitarEFechar}>Li e aceito</Botao>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default AceiteDosDocumentos;
