import { http, HttpResponse } from "msw";
import { rota } from "../apoio/rota";
import { conflito, naoEncontrado } from "../apoio/erros";
import { exigirPapel, usuarioAutenticado } from "../apoio/acesso";
import { registrarAuditoria } from "../apoio/auditoria";
import { agora } from "../apoio/tempo";
import { GRUPOS_MUSCULARES, listarOpcoes, NIVEIS } from "../apoio/opcoes";
import { aparado, cabe, criarValidacao, MENSAGEM_SEM_MARCACAO, preenchido, semMarcacao } from "../apoio/validacao";
import {
  aprovarComoProfessor,
  camposDeModeracao,
  decidirSituacao,
  EDITORES,
  EM_ANALISE,
  exigirAutorOuAdministrador,
  exigirVagaDoProfessor,
  ordenarPorCriacao,
  podeVer,
  removerAprovacoes,
  voltarParaAnalise,
} from "../apoio/moderacao";

const TIPO = "EXERCICIO";
const IMAGEM_PERMITIDA = /^(https:\/\/[^\s<>"']+|\/images\/[\w.-]+)$/;
const ID_DO_YOUTUBE = /^[A-Za-z0-9_-]{11}$/;

function paraDTO(banco, exercicio, usuario) {
  return {
    id: exercicio.id,
    nome: exercicio.nome,
    grupoMuscular: exercicio.grupoMuscular,
    nivel: exercicio.nivel,
    descricaoExecucao: exercicio.descricaoExecucao,
    errosComuns: exercicio.errosComuns,
    aquecimentoRecomendado: exercicio.aquecimentoRecomendado,
    equipamento: exercicio.equipamento,
    gifUrl: exercicio.gifUrl,
    videoYoutubeId: exercicio.videoYoutubeId,
    ...camposDeModeracao(banco, TIPO, exercicio, usuario),
    atualizadoEm: exercicio.atualizadoEm,
  };
}

function buscarExercicio(banco, id) {
  const exercicio = banco.exercicios.find((candidato) => candidato.id === id);
  if (!exercicio) throw naoEncontrado("Exercício não encontrado");
  return exercicio;
}

function validarExercicio(corpo) {
  const gifUrl = aparado(corpo.gifUrl);
  const videoYoutubeId = aparado(corpo.videoYoutubeId);

  criarValidacao()
    .exigir(preenchido(corpo.nome), "nome", "O nome do exercício é obrigatório")
    .exigir(cabe(corpo.nome?.trim(), 120), "nome", "O nome deve ter no máximo 120 caracteres")
    .exigir(semMarcacao(corpo.nome), "nome", MENSAGEM_SEM_MARCACAO)
    .exigir(Object.hasOwn(GRUPOS_MUSCULARES, corpo.grupoMuscular ?? ""), "grupoMuscular", "O grupo muscular é obrigatório")
    .exigir(Object.hasOwn(NIVEIS, corpo.nivel ?? ""), "nivel", "O nível de dificuldade é obrigatório")
    .exigir(preenchido(corpo.descricaoExecucao), "descricaoExecucao", "A descrição da execução é obrigatória")
    .exigir(cabe(corpo.descricaoExecucao, 1000), "descricaoExecucao", "A descrição da execução deve ter no máximo 1000 caracteres")
    .exigir(semMarcacao(corpo.descricaoExecucao), "descricaoExecucao", MENSAGEM_SEM_MARCACAO)
    .exigir(cabe(corpo.errosComuns, 500), "errosComuns", "Os erros comuns devem ter no máximo 500 caracteres")
    .exigir(semMarcacao(corpo.errosComuns), "errosComuns", MENSAGEM_SEM_MARCACAO)
    .exigir(cabe(corpo.aquecimentoRecomendado, 500), "aquecimentoRecomendado", "O aquecimento recomendado deve ter no máximo 500 caracteres")
    .exigir(semMarcacao(corpo.aquecimentoRecomendado), "aquecimentoRecomendado", MENSAGEM_SEM_MARCACAO)
    .exigir(cabe(corpo.equipamento, 100), "equipamento", "O equipamento deve ter no máximo 100 caracteres")
    .exigir(semMarcacao(corpo.equipamento), "equipamento", MENSAGEM_SEM_MARCACAO)
    .exigir(cabe(gifUrl, 255), "gifUrl", "O link da imagem deve ter no máximo 255 caracteres")
    .exigir(!gifUrl || IMAGEM_PERMITIDA.test(gifUrl), "gifUrl", "A imagem deve ser um link https, sem espaços, aspas nem os sinais < e >")
    .exigir(!videoYoutubeId || ID_DO_YOUTUBE.test(videoYoutubeId), "videoYoutubeId", "Informe apenas o id do vídeo do YouTube, com 11 caracteres")
    .concluir();

  return {
    nome: corpo.nome.trim(),
    grupoMuscular: corpo.grupoMuscular,
    nivel: corpo.nivel,
    descricaoExecucao: corpo.descricaoExecucao.trim(),
    errosComuns: aparado(corpo.errosComuns) ?? "",
    aquecimentoRecomendado: aparado(corpo.aquecimentoRecomendado) ?? "",
    equipamento: aparado(corpo.equipamento) ?? "",
    gifUrl,
    videoYoutubeId,
  };
}

function exigirNomeUnico(banco, nome, excetoId) {
  const repetido = banco.exercicios.some(
    (exercicio) => exercicio.nome.toLowerCase() === nome.toLowerCase() && exercicio.id !== excetoId,
  );
  if (repetido) throw conflito(`Já existe um exercício cadastrado com o nome: ${nome}`);
}

export const manipuladoresDeExercicios = [
  http.get(
    "/api/exercicios/grupos-musculares",
    rota(() => listarOpcoes(GRUPOS_MUSCULARES)),
  ),

  http.get(
    "/api/exercicios/niveis",
    rota(() => listarOpcoes(NIVEIS)),
  ),

  http.get(
    "/api/exercicios/pendentes",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "ADMINISTRADOR");
      const pendentes = banco.exercicios.filter((exercicio) => EM_ANALISE.includes(exercicio.status));
      return ordenarPorCriacao(pendentes, true).map((exercicio) => paraDTO(banco, exercicio, usuario));
    }),
  ),

  http.get(
    "/api/exercicios",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      return banco.exercicios
        .filter((exercicio) => podeVer(exercicio, usuario))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
        .map((exercicio) => paraDTO(banco, exercicio, usuario));
    }),
  ),

  http.get(
    "/api/exercicios/:id",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      const exercicio = buscarExercicio(banco, params.id);
      if (!podeVer(exercicio, usuario)) throw naoEncontrado("Exercício não encontrado");
      return paraDTO(banco, exercicio, usuario);
    }),
  ),

  http.post(
    "/api/exercicios",
    rota(({ request, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const dados = validarExercicio(corpo);
      exigirNomeUnico(banco, dados.nome);
      exigirVagaDoProfessor(banco.exercicios, usuario, "exercícios");

      const exercicio = {
        id: crypto.randomUUID(),
        ...dados,
        autorId: usuario.id,
        status: usuario.papel === "ADMINISTRADOR" ? "APROVADO" : "PENDENTE",
        motivoRejeicao: null,
        criadoEm: agora(),
        atualizadoEm: null,
      };
      banco.exercicios.push(exercicio);
      registrarAuditoria(banco, { acao: "CRIADO", recursoTipo: TIPO, recursoId: exercicio.id, usuarioId: usuario.id });

      return HttpResponse.json(paraDTO(banco, exercicio, usuario), { status: 201 });
    }),
  ),

  http.put(
    "/api/exercicios/:id",
    rota(({ request, params, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const exercicio = buscarExercicio(banco, params.id);
      exigirAutorOuAdministrador(exercicio, usuario);
      const dados = validarExercicio(corpo);
      if (dados.grupoMuscular !== exercicio.grupoMuscular) {
        throw conflito("O grupo muscular não pode ser alterado");
      }
      exigirNomeUnico(banco, dados.nome, exercicio.id);

      Object.assign(exercicio, dados, { atualizadoEm: agora() });
      if (usuario.papel !== "ADMINISTRADOR") voltarParaAnalise(banco, TIPO, exercicio);
      registrarAuditoria(banco, { acao: "ATUALIZADO", recursoTipo: TIPO, recursoId: exercicio.id, usuarioId: usuario.id });

      return paraDTO(banco, exercicio, usuario);
    }),
  ),

  http.delete(
    "/api/exercicios/:id",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const exercicio = buscarExercicio(banco, params.id);
      exigirAutorOuAdministrador(exercicio, usuario);

      banco.exercicios = banco.exercicios.filter((candidato) => candidato.id !== exercicio.id);
      removerAprovacoes(banco, TIPO, exercicio.id);
      registrarAuditoria(banco, { acao: "EXCLUIDO", recursoTipo: TIPO, recursoId: exercicio.id, usuarioId: usuario.id });
    }),
  ),

  http.post(
    "/api/exercicios/:id/aprovacoes",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "PROFESSOR");
      const exercicio = buscarExercicio(banco, params.id);
      aprovarComoProfessor(banco, TIPO, exercicio, usuario, "um exercício");
      return paraDTO(banco, exercicio, usuario);
    }),
  ),

  http.patch(
    "/api/exercicios/:id/status",
    rota(({ request, params, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "ADMINISTRADOR");
      const exercicio = buscarExercicio(banco, params.id);
      decidirSituacao(banco, TIPO, exercicio, corpo, usuario, "Este exercício já foi decidido");
      return paraDTO(banco, exercicio, usuario);
    }),
  ),
];
