import AvisoCref from "../components/AvisoCref";
import Botao from "../components/ui/Botao";

function AvisoCrefNoLogin({ situacao, motivo, aoVerConta, aoFechar }) {
  return (
    <div className="space-y-5">
      <h2 className="font-titulo text-xl font-bold text-texto">Sua verificação do CREF</h2>
      <AvisoCref situacao={situacao} motivo={motivo} />
      <div className="flex flex-wrap justify-end gap-3">
        <Botao variante="secundario" onClick={aoFechar}>
          Fechar
        </Botao>
        <Botao onClick={aoVerConta}>Ver minha conta</Botao>
      </div>
    </div>
  );
}

export default AvisoCrefNoLogin;
