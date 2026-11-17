import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../ui/Modal";
import ExercicioForm from "./ExercicioForm";
import { EXERCICIO_VAZIO, exercicioParaEnvio, validarExercicio } from "./exercicioCampos";
import { criarExercicio } from "../../services/exercicioService";
import CabecalhoPagina from "../ui/CabecalhoPagina";
import { ICONES_DAS_PAGINAS } from "../../utils/iconesDasPaginas";
import { subtituloPorPapel } from "../../utils/subtitulosDasPaginas";
import { estiloDeBotao } from "../ui/estiloDeBotao";

function LibraryHead({ gruposMusculares, niveis, carregandoOpcoes, criacaoBloqueada = false, aoCriar, aoConferirLimite, podeEditar, papel }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(EXERCICIO_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function fecharModal() {
    setModalAberto(false);
    setForm(EXERCICIO_VAZIO);
    setErro(null);
  }

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    const mensagemInvalida = validarExercicio(form);
    if (mensagemInvalida) {
      setErro(mensagemInvalida);
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const novo = await criarExercicio(exercicioParaEnvio(form));
      aoCriar(novo);
      fecharModal();
    } catch (err) {
      if (err.itensDoLimite) aoConferirLimite?.(err.itensDoLimite);
      setErro(err.mensagem || "Não foi possível cadastrar o exercício.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <CabecalhoPagina
        titulo="Biblioteca de exercícios"
        subtitulo={subtituloPorPapel("biblioteca", papel)}
        icone={ICONES_DAS_PAGINAS.biblioteca}
      >
        {podeEditar && (
          <>
            <button
              onClick={() => setModalAberto(true)}
              disabled={carregandoOpcoes || criacaoBloqueada}
              className={estiloDeBotao()}
            >
              <Plus size={16} aria-hidden="true" />
              Novo exercício
            </button>
            <Modal aberto={modalAberto} aoFechar={fecharModal} largura="larga">
              <ExercicioForm
                titulo="Criar exercício"
                valores={form}
                aoAlterar={handleChange}
                aoEnviar={handleSubmit}
                gruposMusculares={gruposMusculares}
                niveis={niveis}
                carregandoOpcoes={carregandoOpcoes}
                enviando={enviando}
                erro={erro}
                textoBotao="Cadastrar"
                textoBotaoEnviando="Cadastrando..."
              />
            </Modal>
          </>
        )}
      </CabecalhoPagina>
  );
}

export default LibraryHead;
