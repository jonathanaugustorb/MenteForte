import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Modal from "../ui/Modal";
import EstadoRequisicao from "../ui/EstadoRequisicao";
import ConfirmarAnonimizacao from "./ConfirmarAnonimizacao";
import {
  anonimizarUsuario,
  listarAnonimizacoesPendentes,
} from "../../services/usuarioService";
import { rotuloDoPapel } from "../../utils/papeis";
import { formatarDataCurta } from "../../utils/formatar";
import { estiloDeBotao } from "../ui/estiloDeBotao";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-marca-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-texto-suave align-top";


function PedidosDeExclusao() {
  const { avisar } = useOutletContext();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [pedidoEmAnonimizacao, setPedidoEmAnonimizacao] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarAnonimizacoesPendentes()
      .then((lista) => {
        if (!ativo) return;
        setPedidos(lista);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os pedidos de exclusão.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function anonimizar(pedidoEscolhido) {
    await anonimizarUsuario(pedidoEscolhido.id);
    setPedidos((atuais) =>
      atuais.filter((pedido) => pedido.id !== pedidoEscolhido.id),
    );
    avisar({
      tipo: "sucesso",
      titulo: "Conta anonimizada",
      mensagem: `Os dados pessoais de ${pedidoEscolhido.nomeCompleto} foram apagados.`,
    });
    setPedidoEmAnonimizacao(null);
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
          Pedidos de exclusão de conta
            {!carregando && !erro && ` (${pedidos.length})`}
        </h2>
        <p className="mt-1 text-sm text-texto-fraco">
          Contas cujo dono pediu a exclusão. Anonimizar apaga os dados pessoais
          e não pode ser desfeito.
        </p>
      </div>

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando pedidos..."
        erro={erro}
        vazio={pedidos.length === 0}
        mensagemVazio="Nenhum pedido de exclusão aguardando."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-borda">
                <th className={ESTILO_CABECALHO}>Usuário</th>
                <th className={ESTILO_CABECALHO}>Perfil</th>
                <th className={ESTILO_CABECALHO}>Pedido em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-borda">
                  <td className={`${ESTILO_CELULA} wrap-anywhere`}>
                    <span className="block text-white">{pedido.nomeCompleto}</span>
                    <span className="block text-xs text-texto-fraco">{pedido.email}</span>
                  </td>
                  <td className={ESTILO_CELULA}>{rotuloDoPapel(pedido.papel)}</td>
                  <td className={ESTILO_CELULA}>
                    {formatarDataCurta(pedido.solicitadaEm)}
                  </td>
                  <td className={ESTILO_CELULA}>
                    <button
                      type="button"
                      onClick={() => setPedidoEmAnonimizacao(pedido)}
                      className={estiloDeBotao({ variante: "perigo", tamanho: "pequeno" })}
                    >
                      Anonimizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>

      <Modal
        aberto={pedidoEmAnonimizacao !== null}
        aoFechar={() => setPedidoEmAnonimizacao(null)}
      >
        {pedidoEmAnonimizacao && (
          <ConfirmarAnonimizacao
            key={pedidoEmAnonimizacao.id}
            usuario={{
              ...pedidoEmAnonimizacao,
              anonimizacaoSolicitadaEm: pedidoEmAnonimizacao.solicitadaEm,
            }}
            aoConfirmar={() => anonimizar(pedidoEmAnonimizacao)}
            aoCancelar={() => setPedidoEmAnonimizacao(null)}
          />
        )}
      </Modal>
    </section>
  );
}

export default PedidosDeExclusao;