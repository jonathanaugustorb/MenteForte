import { useId } from "react";
import Alerta from "../ui/Alerta";
import Botao from "../ui/Botao";
import Campo from "../ui/Campo";
import Contador from "../ui/Contador";
import { ESTILO_ENTRADA } from "../ui/estiloDeCampo";
import {
  LIMITE_AUTORIA,
  LIMITE_FONTE,
  LIMITE_RESUMO,
  LIMITE_TIPO_ESTUDO,
  LIMITE_TITULO,
  MINIMO_RESUMO,
} from "./artigoCampos";

function ArtigoForm({
  titulo,
  valores,
  aoAlterar,
  aoEnviar,
  categorias,
  carregandoOpcoes,
  enviando,
  erro,
  camposComErro = [],
  textoBotao,
  textoBotaoEnviando,
}) {
  const idBase = useId();
  const campoId = (campo) => `${idBase}-${campo}`;

  return (
    <form onSubmit={aoEnviar} className="space-y-5">
      <h2 className="font-titulo text-xl font-bold text-texto">{titulo}</h2>

      {erro && (
        <Alerta tipo="erro">
          {camposComErro.length > 0 ? (
            <ul className="list-disc pl-5">
              {camposComErro.map((campo) => (
                <li key={`${campo.campo}-${campo.mensagem}`}>{campo.mensagem}</li>
              ))}
            </ul>
          ) : (
            <p>{erro}</p>
          )}
        </Alerta>
      )}

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <Campo id={campoId("titulo")} rotulo="Título" obrigatorio>
          <input
            id={campoId("titulo")}
            name="titulo"
            value={valores.titulo}
            onChange={aoAlterar}
            maxLength={LIMITE_TITULO}
            className={ESTILO_ENTRADA}
          />
        </Campo>
        <Campo id={campoId("categoria")} rotulo="Categoria" obrigatorio>
          <select
            id={campoId("categoria")}
            name="categoria"
            value={valores.categoria}
            onChange={aoAlterar}
            disabled={carregandoOpcoes}
            className={ESTILO_ENTRADA}
          >
            <option value="">{carregandoOpcoes ? "Carregando..." : "Selecione"}</option>
            {categorias.map((categoria) => (
              <option key={categoria.codigo} value={categoria.codigo}>
                {categoria.descricao}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo id={campoId("resumo")} rotulo="Resumo" obrigatorio>
        <textarea
          id={campoId("resumo")}
          name="resumo"
          value={valores.resumo}
          onChange={aoAlterar}
          rows={6}
          maxLength={LIMITE_RESUMO}
          placeholder="Uma síntese do estudo, escrita por você"
          aria-describedby={campoId("resumo-contador")}
          className={ESTILO_ENTRADA}
        />
        <Contador
          id={campoId("resumo-contador")}
          atual={valores.resumo.length}
          maximo={LIMITE_RESUMO}
          minimo={MINIMO_RESUMO}
        />
      </Campo>

      <Campo id={campoId("fonte")} rotulo="Link do estudo" dica="Endereço https da fonte." obrigatorio>
        <input
          id={campoId("fonte")}
          name="fonte"
          inputMode="url"
          value={valores.fonte}
          onChange={aoAlterar}
          maxLength={LIMITE_FONTE}
          placeholder="https://..."
          className={ESTILO_ENTRADA}
        />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_9rem]">
        <Campo id={campoId("autoria")} rotulo="Autoria do estudo">
          <input
            id={campoId("autoria")}
            name="autoria"
            value={valores.autoria}
            onChange={aoAlterar}
            maxLength={LIMITE_AUTORIA}
            placeholder="Opcional"
            className={ESTILO_ENTRADA}
          />
        </Campo>
        <Campo id={campoId("tipoEstudo")} rotulo="Tipo de estudo">
          <input
            id={campoId("tipoEstudo")}
            name="tipoEstudo"
            value={valores.tipoEstudo}
            onChange={aoAlterar}
            maxLength={LIMITE_TIPO_ESTUDO}
            placeholder="Ex.: revisão sistemática"
            className={ESTILO_ENTRADA}
          />
        </Campo>
        <Campo id={campoId("ano")} rotulo="Ano">
          <input
            id={campoId("ano")}
            name="ano"
            type="number"
            value={valores.ano}
            onChange={aoAlterar}
            min="1900"
            max={new Date().getFullYear()}
            placeholder="2024"
            className={ESTILO_ENTRADA}
          />
        </Campo>
      </div>

      <Botao type="submit" larguraTotal disabled={enviando}>
        {enviando ? textoBotaoEnviando : textoBotao}
      </Botao>
    </form>
  );
}

export default ArtigoForm;
