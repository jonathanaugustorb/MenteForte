import { useId } from "react";
import EditorDeEtapas from "./EditorDeEtapas";
import Alerta from "../ui/Alerta";
import Botao from "../ui/Botao";
import Campo from "../ui/Campo";
import Contador from "../ui/Contador";
import { ESTILO_ENTRADA } from "../ui/estiloDeCampo";
import {
  LIMITE_AQUECIMENTO,
  LIMITE_EQUIPAMENTO,
  LIMITE_ERROS_COMUNS,
  LIMITE_GIF_URL,
  LIMITE_NOME,
  LIMITE_VIDEO,
} from "./exercicioCampos";

function ExercicioForm({
  titulo,
  valores,
  aoAlterar,
  aoEnviar,
  gruposMusculares,
  niveis,
  carregandoOpcoes,
  grupoMuscularBloqueado = false,
  enviando,
  erro,
  textoBotao,
  textoBotaoEnviando,
}) {
  const idBase = useId();
  const campoId = (campo) => `${idBase}-${campo}`;

  return (
    <form onSubmit={aoEnviar} className="space-y-5">
      <h2 className="font-titulo text-xl font-bold text-texto">{titulo}</h2>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <Campo id={campoId("nome")} rotulo="Nome do exercício" obrigatorio>
        <input
          id={campoId("nome")}
          name="nome"
          value={valores.nome}
          onChange={aoAlterar}
          maxLength={LIMITE_NOME}
          className={ESTILO_ENTRADA}
        />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          id={campoId("grupoMuscular")}
          rotulo="Grupo muscular"
          dica={grupoMuscularBloqueado ? "O grupo muscular não pode ser alterado." : undefined}
          obrigatorio
        >
          <select
            id={campoId("grupoMuscular")}
            name="grupoMuscular"
            value={valores.grupoMuscular}
            onChange={aoAlterar}
            disabled={grupoMuscularBloqueado || carregandoOpcoes}
            className={ESTILO_ENTRADA}
          >
            <option value="">{carregandoOpcoes ? "Carregando..." : "Selecione"}</option>
            {gruposMusculares.map((grupo) => (
              <option key={grupo.codigo} value={grupo.codigo}>
                {grupo.descricao}
              </option>
            ))}
          </select>
        </Campo>
        <Campo id={campoId("nivel")} rotulo="Nível" obrigatorio>
          <select
            id={campoId("nivel")}
            name="nivel"
            value={valores.nivel}
            onChange={aoAlterar}
            disabled={carregandoOpcoes}
            className={ESTILO_ENTRADA}
          >
            <option value="">{carregandoOpcoes ? "Carregando..." : "Selecione"}</option>
            {niveis.map((nivel) => (
              <option key={nivel.codigo} value={nivel.codigo}>
                {nivel.descricao}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <EditorDeEtapas
        etapas={valores.etapas}
        aoMudar={(etapas) => aoAlterar({ target: { name: "etapas", value: etapas } })}
      />

      <Campo id={campoId("errosComuns")} rotulo="Erros comuns">
        <textarea
          id={campoId("errosComuns")}
          name="errosComuns"
          value={valores.errosComuns}
          onChange={aoAlterar}
          rows={3}
          maxLength={LIMITE_ERROS_COMUNS}
          className={ESTILO_ENTRADA}
        />
        <Contador atual={valores.errosComuns.length} maximo={LIMITE_ERROS_COMUNS} />
      </Campo>

      <Campo id={campoId("aquecimentoRecomendado")} rotulo="Aquecimento recomendado">
        <textarea
          id={campoId("aquecimentoRecomendado")}
          name="aquecimentoRecomendado"
          value={valores.aquecimentoRecomendado}
          onChange={aoAlterar}
          rows={3}
          maxLength={LIMITE_AQUECIMENTO}
          className={ESTILO_ENTRADA}
        />
        <Contador atual={valores.aquecimentoRecomendado.length} maximo={LIMITE_AQUECIMENTO} />
      </Campo>

      <Campo id={campoId("equipamento")} rotulo="Equipamento">
        <input
          id={campoId("equipamento")}
          name="equipamento"
          value={valores.equipamento}
          onChange={aoAlterar}
          maxLength={LIMITE_EQUIPAMENTO}
          className={ESTILO_ENTRADA}
        />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={campoId("gifUrl")} rotulo="Imagem ou GIF" dica="Link https da imagem.">
          <input
            id={campoId("gifUrl")}
            name="gifUrl"
            value={valores.gifUrl}
            onChange={aoAlterar}
            maxLength={LIMITE_GIF_URL}
            placeholder="https://..."
            className={ESTILO_ENTRADA}
          />
        </Campo>
        <Campo id={campoId("videoYoutubeId")} rotulo="Vídeo no YouTube" dica="Cole o endereço do vídeo.">
          <input
            id={campoId("videoYoutubeId")}
            name="videoYoutubeId"
            value={valores.videoYoutubeId}
            onChange={aoAlterar}
            maxLength={LIMITE_VIDEO}
            placeholder="https://youtu.be/..."
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

export default ExercicioForm;
