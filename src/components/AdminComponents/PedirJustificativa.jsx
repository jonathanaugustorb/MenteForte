import { useState } from "react";
import Modal from "../ui/Modal";
import Campo from "../ui/Campo";
import Botao from "../ui/Botao";
import { ESTILO_ENTRADA } from "../ui/estiloDeCampo";

const MINIMO = 10;
const MAXIMO = 255;

export default function PedirJustificativa({
  nomeDaPessoa,
  aoConfirmar,
  aoCancelar,
  enviando = false,
}) {
  const [justificativa, setJustificativa] = useState("");

  const texto = justificativa.trim();
  const podeConfirmar = texto.length >= MINIMO && !enviando;

  function enviar(evento) {
    evento.preventDefault();
    if (podeConfirmar) aoConfirmar(texto);
  }

  return (
    <Modal aberto aoFechar={aoCancelar} largura="estreita">
      <form onSubmit={enviar} className="flex flex-col gap-5">
        <div className="space-y-2">
          <h2 className="font-titulo text-xl font-bold">Por que abrir os dados completos?</h2>
          <p className="text-sm text-texto-suave">
            Abrir os dados de{" "}
            <span className="font-semibold text-texto">{nomeDaPessoa}</span> sem
            máscara fica registrado na trilha de auditoria, junto com esta
            justificativa.
          </p>
        </div>

        <Campo
          id="justificativa"
          rotulo="Justificativa"
          dica={
            texto.length < MINIMO
              ? `Escreva pelo menos ${MINIMO} caracteres.`
              : `${justificativa.length} de ${MAXIMO} caracteres.`
          }
        >
          <textarea
            id="justificativa"
            name="justificativa"
            rows={3}
            maxLength={MAXIMO}
            value={justificativa}
            onChange={(evento) => setJustificativa(evento.target.value)}
            placeholder="Ex.: conferir o CREF enviado pelo professor"
            aria-describedby="justificativa-dica"
            className={ESTILO_ENTRADA}
          />
        </Campo>

        <div className="flex justify-end gap-3">
          <Botao variante="secundario" onClick={aoCancelar}>
            Cancelar
          </Botao>
          <Botao type="submit" disabled={!podeConfirmar}>
            {enviando ? "Abrindo..." : "Abrir dados"}
          </Botao>
        </div>
      </form>
    </Modal>
  );
}
