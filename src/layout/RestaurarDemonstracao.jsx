import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Alerta from "../components/ui/Alerta";
import Botao from "../components/ui/Botao";
import Modal from "../components/ui/Modal";
import { restaurarDemonstracao } from "../demo/iniciarDemonstracao";

function RestaurarDemonstracao() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="inline-flex items-center gap-1.5 text-texto-fraco underline-offset-4 hover:text-texto hover:underline cursor-pointer"
      >
        <RotateCcw size={13} aria-hidden="true" />
        Restaurar dados da demonstração
      </button>

      <Modal aberto={aberto} aoFechar={() => setAberto(false)} largura="estreita">
        <div className="space-y-5">
          <h2 className="font-titulo text-xl font-bold text-texto">Restaurar dados da demonstração</h2>
          <Alerta tipo="aviso">
            Contas criadas, conteúdos, respostas de quiz e registros de auditoria feitos neste navegador
            serão apagados. Tudo volta ao conteúdo inicial e você sai da conta.
          </Alerta>
          <div className="flex justify-end gap-3">
            <Botao variante="secundario" onClick={() => setAberto(false)}>
              Cancelar
            </Botao>
            <Botao variante="perigo" onClick={restaurarDemonstracao}>
              Restaurar
            </Botao>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RestaurarDemonstracao;
