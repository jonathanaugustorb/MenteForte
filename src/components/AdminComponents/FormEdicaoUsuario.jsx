import { useState } from "react";
import Alerta from "../ui/Alerta";
import Botao from "../ui/Botao";
import Campo from "../ui/Campo";
import { ESTILO_ENTRADA } from "../ui/estiloDeCampo";
import { formatarDataCurta } from "../../utils/formatar";
import { rotuloDoPapel } from "../../utils/papeis";
import { LIMITE_EMAIL, LIMITE_NOME_COMPLETO } from "../../utils/limites";

function FormEdicaoUsuario({ usuario, aoSalvar, aoCancelar }) {
  const [dados, setDados] = useState({ nomeCompleto: usuario.nomeCompleto, email: usuario.email });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  function alterar(evento) {
    const { name, value } = evento.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro(null);
    setCamposComErro([]);
    try {
      await aoSalvar(dados);
    } catch (falha) {
      setErro(falha.mensagem || "Não foi possível salvar. Tente novamente.");
      setCamposComErro(falha.campos ?? []);
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-titulo text-xl font-bold text-texto">Editar usuário</h2>
        <p className="text-sm text-texto-fraco">A abertura e as alterações entram na trilha de auditoria.</p>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-xl border border-borda bg-fundo/40 p-4 text-sm">
        <div>
          <dt className="text-xs text-texto-fraco">Perfil</dt>
          <dd className="mt-0.5 text-texto">{rotuloDoPapel(usuario.papel)}</dd>
        </div>
        <div>
          <dt className="text-xs text-texto-fraco">Cadastrada em</dt>
          <dd className="mt-0.5 text-texto">{formatarDataCurta(usuario.criadoEm)}</dd>
        </div>
      </dl>

      <Campo id="edicao-nome" rotulo="Nome completo" obrigatorio>
        <input
          id="edicao-nome"
          name="nomeCompleto"
          value={dados.nomeCompleto}
          onChange={alterar}
          maxLength={LIMITE_NOME_COMPLETO}
          className={ESTILO_ENTRADA}
        />
      </Campo>

      <Campo id="edicao-email" rotulo="E-mail" obrigatorio>
        <input
          id="edicao-email"
          name="email"
          type="email"
          value={dados.email}
          onChange={alterar}
          maxLength={LIMITE_EMAIL}
          className={ESTILO_ENTRADA}
        />
      </Campo>

      {erro && (
        <Alerta tipo="erro">
          {camposComErro.length > 0 ? (
            <ul className="list-disc pl-5">
              {camposComErro.map((campo) => (
                <li key={campo.campo}>{campo.mensagem}</li>
              ))}
            </ul>
          ) : (
            <p>{erro}</p>
          )}
        </Alerta>
      )}

      <div className="flex justify-end gap-3">
        <Botao variante="secundario" onClick={aoCancelar} disabled={salvando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </Botao>
      </div>
    </form>
  );
}

export default FormEdicaoUsuario;
