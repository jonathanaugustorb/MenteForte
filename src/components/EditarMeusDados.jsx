import { useState } from "react";
import Alerta from "./ui/Alerta";
import Botao from "./ui/Botao";
import Campo from "./ui/Campo";
import { ESTILO_ENTRADA } from "./ui/estiloDeCampo";
import { LIMITE_NOME_COMPLETO } from "../utils/limites";

function EditarMeusDados({ conta, aoSalvar, aoCancelar }) {
  const [nomeCompleto, setNomeCompleto] = useState(conta.nomeCompleto);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const mudou = nomeCompleto.trim() !== "" && nomeCompleto.trim() !== conta.nomeCompleto;

  async function salvar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await aoSalvar({ nomeCompleto: nomeCompleto.trim() });
    } catch (falha) {
      setErro(falha.mensagem || "Não foi possível salvar os seus dados.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="space-y-5">
      <h2 className="font-titulo text-xl font-bold text-texto">Editar meus dados</h2>

      <Campo id="editar-nome" rotulo="Nome completo" obrigatorio>
        <input
          id="editar-nome"
          value={nomeCompleto}
          onChange={(evento) => setNomeCompleto(evento.target.value)}
          maxLength={LIMITE_NOME_COMPLETO}
          autoComplete="name"
          className={ESTILO_ENTRADA}
        />
      </Campo>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <div className="flex justify-end gap-3">
        <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={!mudou || enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </Botao>
      </div>
    </form>
  );
}

export default EditarMeusDados;
