import { PESSOAS } from "./pessoas";
import { ARTIGOS } from "./artigos";
import { QUIZZES, TENTATIVAS } from "./quizzes";
import { EXERCICIOS } from "./exercicios";
import { protegerSenha } from "../apoio/senha";
import { momentoHaDias } from "../apoio/tempo";
import { SENHA_DE_TESTE } from "../contasDeTeste";

const ATIVIDADE_DA_SEMANA = [
  ["aluno", "juliana", "admin"],
  ["professor", "pedro", "aluno", "ana", "admin"],
  ["aluno", "carla"],
  ["professor", "juliana", "bruno", "aluno", "pedro", "admin"],
  ["aluno", "ana", "professor", "admin"],
  ["juliana", "pedro"],
  ["aluno", "professor", "admin"],
];

async function criarUsuarios() {
  const entradas = Object.entries(PESSOAS);
  const senhas = await Promise.all(entradas.map(() => protegerSenha(SENHA_DE_TESTE)));
  const ids = {};

  const usuarios = entradas.map(([chave, pessoa], indice) => {
    const id = crypto.randomUUID();
    ids[chave] = id;
    return {
      id,
      nomeCompleto: pessoa.nomeCompleto,
      email: pessoa.email,
      papel: pessoa.papel,
      ...senhas[indice],
      ativo: !pessoa.inativa,
      criadoEm: momentoHaDias(pessoa.criadoHaDias, 9),
      versaoTermosUso: "1.0",
      versaoPoliticaPrivacidade: "1.0",
      anonimizacaoSolicitadaEm: pessoa.pediuExclusaoHaDias
        ? momentoHaDias(pessoa.pediuExclusaoHaDias, 15)
        : null,
      anonimizadoEm: null,
    };
  });

  return { ids, usuarios };
}

function registrar(auditoria, acao, recursoTipo, recursoId, usuarioId, ocorridoEm) {
  auditoria.push({
    id: crypto.randomUUID(),
    ocorridoEm,
    acao,
    recursoTipo,
    recursoId,
    usuarioId,
    justificativa: null,
  });
}

function criarConteudo({ definicoes, tipo, ids, adminId, aprovacoes, auditoria, montar }) {
  const idsDoConteudo = {};

  const itens = Object.entries(definicoes).map(([chave, definicao]) => {
    const id = crypto.randomUUID();
    idsDoConteudo[chave] = id;
    const autorId = definicao.autor ? ids[definicao.autor] : null;
    const criadoEm = momentoHaDias(definicao.criadoHaDias, 11);

    registrar(auditoria, "CRIADO", tipo, id, autorId ?? adminId, criadoEm);

    (definicao.aprovadoPor ?? []).forEach((chaveDoProfessor, posicao) => {
      const aprovadoEm = momentoHaDias(Math.max(definicao.criadoHaDias - 1, 0), 14 + posicao);
      aprovacoes.push({ tipo, itemId: id, professorId: ids[chaveDoProfessor], aprovadoEm });
      registrar(auditoria, "APROVADO", tipo, id, ids[chaveDoProfessor], aprovadoEm);
    });

    if (["APROVADO", "REJEITADO"].includes(definicao.status) && autorId) {
      const acao = definicao.status === "APROVADO" ? "APROVADO" : "REJEITADO";
      registrar(auditoria, acao, tipo, id, adminId, momentoHaDias(Math.max(definicao.criadoHaDias - 1, 0), 17));
    }

    return {
      id,
      ...montar(definicao),
      autorId,
      status: definicao.status,
      motivoRejeicao: definicao.motivoRejeicao ?? null,
      criadoEm,
      atualizadoEm: null,
    };
  });

  return { itens, idsDoConteudo };
}

function montarArtigo({ titulo, categoria, resumo, fonte, autoria, tipoEstudo, ano }) {
  return { titulo, categoria, resumo, fonte, autoria, tipoEstudo, ano };
}

function montarExercicio({ nome, grupoMuscular, nivel, gifUrl, equipamento, etapas, errosComuns, aquecimentoRecomendado }) {
  return {
    nome,
    grupoMuscular,
    nivel,
    descricaoExecucao: etapas.join("\n"),
    errosComuns,
    aquecimentoRecomendado,
    equipamento,
    gifUrl,
    videoYoutubeId: null,
  };
}

function montarQuiz(idsDosArtigos) {
  return ({ titulo, descricao, categoria, nivel, artigos, questoes }) => ({
    titulo,
    descricao,
    categoria,
    nivel,
    artigoIds: artigos.map((chave) => idsDosArtigos[chave]),
    questoes: questoes.map((questao) => ({
      id: crypto.randomUUID(),
      enunciado: questao.enunciado,
      explicacao: questao.explicacao,
      alternativas: questao.alternativas.map((alternativa) => ({ id: crypto.randomUUID(), ...alternativa })),
    })),
  });
}

function registrarAtividadeDaSemana(auditoria, ids) {
  ATIVIDADE_DA_SEMANA.forEach((pessoas, posicao) => {
    const haDias = ATIVIDADE_DA_SEMANA.length - 1 - posicao;
    pessoas.forEach((chave, ordem) => {
      registrar(auditoria, "LOGIN_REALIZADO", "USUARIO", ids[chave], ids[chave], momentoHaDias(haDias, 8 + ordem, 15));
    });
  });
  registrar(auditoria, "LOGIN_FALHOU", "USUARIO", ids.pedro, ids.pedro, momentoHaDias(3, 7, 50));
  registrar(auditoria, "LOGIN_FALHOU", "USUARIO", null, null, momentoHaDias(1, 22, 10));
}

export async function criarDadosIniciais() {
  const { ids, usuarios } = await criarUsuarios();
  const aprovacoes = [];
  const auditoria = [];

  usuarios.forEach((usuario) => registrar(auditoria, "CRIADO", "USUARIO", usuario.id, null, usuario.criadoEm));

  const artigos = criarConteudo({
    definicoes: ARTIGOS,
    tipo: "ARTIGO",
    ids,
    adminId: ids.admin,
    aprovacoes,
    auditoria,
    montar: montarArtigo,
  });

  const quizzes = criarConteudo({
    definicoes: QUIZZES,
    tipo: "QUIZ",
    ids,
    adminId: ids.admin,
    aprovacoes,
    auditoria,
    montar: montarQuiz(artigos.idsDoConteudo),
  });

  const exercicios = criarConteudo({
    definicoes: Object.fromEntries(EXERCICIOS.map((exercicio, indice) => [indice, exercicio])),
    tipo: "EXERCICIO",
    ids,
    adminId: ids.admin,
    aprovacoes,
    auditoria,
    montar: montarExercicio,
  });

  const tentativas = TENTATIVAS.map(({ pessoa, quiz, acertos, haDias }) => ({
    id: crypto.randomUUID(),
    quizId: quizzes.idsDoConteudo[quiz],
    usuarioId: ids[pessoa],
    acertos,
    total: QUIZZES[quiz].questoes.length,
    feitaEm: momentoHaDias(haDias, 19),
  }));

  registrarAtividadeDaSemana(auditoria, ids);
  auditoria.sort((a, b) => a.ocorridoEm.localeCompare(b.ocorridoEm));

  return {
    usuarios,
    sessoes: {},
    artigos: artigos.itens,
    quizzes: quizzes.itens,
    exercicios: exercicios.itens,
    aprovacoes,
    tentativas,
    auditoria,
  };
}
