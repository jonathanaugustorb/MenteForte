import { CircleAlert, CircleCheck } from "lucide-react";
import Botao from "../components/ui/Botao";

function AvisoDeAcao({ tipo, titulo, mensagem, aoFechar }) {
  const erro = tipo === "erro";
  const Icone = erro ? CircleAlert : CircleCheck;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span
        className={`flex size-14 items-center justify-center rounded-full ${
          erro ? "bg-perigo/10 text-perigo" : "bg-sucesso/10 text-sucesso"
        }`}
      >
        <Icone size={30} aria-hidden="true" />
      </span>
      <h2 className="font-titulo text-xl font-bold text-texto">{titulo}</h2>
      <p role={erro ? "alert" : "status"} className="text-texto-suave">
        {mensagem}
      </p>
      <Botao autoFocus onClick={aoFechar} className="mt-3 min-w-32">
        OK
      </Botao>
    </div>
  );
}

export default AvisoDeAcao;
