import { Inbox } from "lucide-react";
import Alerta from "./Alerta";
import Carregando from "./Carregando";

function EstadoRequisicao({
  carregando,
  mensagemCarregando = "Calculando...",
  erro,
  vazio,
  mensagemVazio,
  children,
}) {
  if (carregando) {
    return <Carregando mensagem={mensagemCarregando} className="py-6" />;
  }

  if (erro) {
    return <Alerta tipo="erro">{erro}</Alerta>;
  }

  if (vazio) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-borda-forte px-6 py-12 text-center text-sm text-texto-suave">
        <Inbox size={28} aria-hidden="true" className="text-texto-fraco" />
        <p>{mensagemVazio}</p>
      </div>
    );
  }

  return children;
}

export default EstadoRequisicao;
