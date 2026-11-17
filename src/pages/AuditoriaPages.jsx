import { useEffect, useState } from "react";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import EstadoRequisicao from "../components/ui/EstadoRequisicao";
import FiltroAuditoria from "../components/AdminComponents/FiltroAuditoria";
import TabelaAuditoria from "../components/AdminComponents/TabelaAuditoria";
import Paginacao from "../components/AdminComponents/Paginacao";
import AbasAdministracao from "../components/AdminComponents/AbasAdministracao";
import {
  buscarAuditoria,
  exportarCsv,
  listarAcoes,
} from "../services/auditoriaService";
import { baixarArquivo } from "../utils/csv";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import { SUBTITULOS_DA_ADMINISTRACAO } from "../utils/subtitulosDasPaginas";
import { estiloDeBotao } from "../components/ui/estiloDeBotao";

const TAMANHO_PAGINA = 50;

const FILTROS_VAZIOS = { de: "", ate: "", acao: "" };

function AuditoriaPages() {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [pagina, setPagina] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [acoes, setAcoes] = useState([]);
  const [consultaConcluida, setConsultaConcluida] = useState(null);
  const consultaAtual = JSON.stringify([pagina, filtros]);
  const carregando = consultaAtual !== consultaConcluida;
  const [erro, setErro] = useState(null);
  const [exportando, setExportando] = useState(false);
  const [erroExportacao, setErroExportacao] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarAcoes()
      .then((lista) => {
        if (ativo) setAcoes(lista);
      })
      .catch(() => {
        if (ativo) setAcoes([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarAuditoria({ pagina, tamanho: TAMANHO_PAGINA, ...filtros })
      .then((dados) => {
        if (!ativo) return;
        setResultado(dados);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setResultado(null);
        setErro(err.mensagem || "Não foi possível carregar a auditoria.");
      })
      .finally(() => {
        if (ativo) setConsultaConcluida(consultaAtual);
      });

    return () => {
      ativo = false;
    };
  }, [pagina, filtros, consultaAtual]);

  function alterarFiltro(campo, valor) {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    setPagina(0);
  }

  function limparFiltros() {
    if (pagina === 0 && Object.values(filtros).every((valor) => valor === "")) return;
    setFiltros(FILTROS_VAZIOS);
    setPagina(0);
  }

  async function exportar() {
    setExportando(true);
    setErroExportacao(null);

    try {
      const arquivo = await exportarCsv(filtros);
      const dia = new Date().toISOString().slice(0, 10);
      baixarArquivo(`auditoria-${dia}.csv`, arquivo);
    } catch (err) {
      setErroExportacao(err.mensagem || "Não foi possível exportar os registros.");
    } finally {
      setExportando(false);
    }
  }

  const registros = resultado?.conteudo ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
      <CabecalhoPagina
        titulo="Trilha de auditoria"
        subtitulo={SUBTITULOS_DA_ADMINISTRACAO.auditoria}
        icone={ICONES_DAS_PAGINAS.administracao}
      />

      <AbasAdministracao />

      <FiltroAuditoria
        filtros={filtros}
        acoes={acoes}
        aoAlterar={alterarFiltro}
        aoLimpar={limparFiltros}
      />

      <div className="mb-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={exportar}
          disabled={exportando || carregando || Boolean(erro) || registros.length === 0}
          className={estiloDeBotao()}
        >
          {exportando ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>

      {erroExportacao && (
        <p role="alert" className="mb-4 rounded-xl border border-perigo/30 bg-perigo/10 p-3 text-sm text-red-100">
          {erroExportacao}
        </p>
      )}

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando registros..."
        erro={erro}
        vazio={registros.length === 0}
        mensagemVazio="Nenhum registro encontrado para estes filtros."
      >
        <TabelaAuditoria registros={registros} />
        <Paginacao
          pagina={resultado?.pagina ?? 0}
          totalDePaginas={resultado?.totalDePaginas ?? 1}
          totalDeItens={resultado?.totalDeItens ?? 0}
          aoMudarPagina={setPagina}
        />
      </EstadoRequisicao>
    </div>
  );
}

export default AuditoriaPages;
