import { http, HttpResponse } from "msw";
import { rota } from "../apoio/rota";
import { conflito, erroDeRegra, naoEncontrado } from "../apoio/erros";
import { exigirPapel, usuarioAutenticado } from "../apoio/acesso";
import { registrarAuditoria } from "../apoio/auditoria";
import { agora } from "../apoio/tempo";
import { CATEGORIAS, NIVEIS, opcao } from "../apoio/opcoes";
import { aparado, cabe, criarValidacao, MENSAGEM_SEM_MARCACAO, preenchido, semMarcacao } from "../apoio/validacao";
import {
  aprovarComoProfessor,
  camposDeModeracao,
  decidirSituacao,
  EDITORES,
  exigirAutorOuAdministrador,
  exigirVagaDoProfessor,
  ordenarPorCriacao,
  podeVer,
  PUBLICADOS,
  removerAprovacoes,
  voltarParaAnalise,
} from "../apoio/moderacao";

const TIPO = "QUIZ";
const NOTA_MINIMA = 70;

function percentual(acertos, total) {
  return Math.round((acertos * 100) / total);
}

function concluido(acertos, total) {
  return acertos * 100 >= NOTA_MINIMA * total;
}

function paraNota(tentativa) {
  return {
    acertos: tentativa.acertos,
    total: tentativa.total,
    percentual: percentual(tentativa.acertos, tentativa.total),
    concluido: concluido(tentativa.acertos, tentativa.total),
  };
}

function melhorTentativa(banco, quizId, usuarioId) {
  return banco.tentativas
    .filter((tentativa) => tentativa.quizId === quizId && tentativa.usuarioId === usuarioId)
    .sort((a, b) => a.feitaEm.localeCompare(b.feitaEm))
    .map(paraNota)
    .reduce((melhor, nota) => (!melhor || nota.percentual >= melhor.percentual ? nota : melhor), null);
}

function paraResumo(banco, quiz, usuario) {
  return {
    id: quiz.id,
    titulo: quiz.titulo,
    descricao: quiz.descricao,
    categoria: opcao(CATEGORIAS, quiz.categoria),
    nivel: opcao(NIVEIS, quiz.nivel),
    ...camposDeModeracao(banco, TIPO, quiz, usuario),
    totalQuestoes: quiz.questoes.length,
    notaMinima: NOTA_MINIMA,
    melhorTentativa: melhorTentativa(banco, quiz.id, usuario.id),
  };
}

function mostraGabarito(quiz, usuario) {
  if (usuario.papel === "ADMINISTRADOR" || quiz.autorId === usuario.id) return true;
  return usuario.papel === "PROFESSOR" && quiz.status === "PENDENTE";
}

function paraDetalhe(banco, quiz, usuario) {
  const gabarito = mostraGabarito(quiz, usuario);
  const artigos = quiz.artigoIds
    .map((artigoId) => banco.artigos.find((artigo) => artigo.id === artigoId))
    .filter((artigo) => artigo && PUBLICADOS.includes(artigo.status))
    .map((artigo) => ({ id: artigo.id, titulo: artigo.titulo }));

  return {
    ...paraResumo(banco, quiz, usuario),
    gabarito,
    artigos,
    questoes: quiz.questoes.map((questao) => ({
      id: questao.id,
      enunciado: questao.enunciado,
      explicacao: gabarito ? questao.explicacao : null,
      alternativas: questao.alternativas.map((alternativa) => ({
        id: alternativa.id,
        texto: alternativa.texto,
        correta: gabarito ? alternativa.correta : null,
      })),
    })),
  };
}

function buscarQuiz(banco, id) {
  const quiz = banco.quizzes.find((candidato) => candidato.id === id);
  if (!quiz) throw naoEncontrado("Quiz não encontrado");
  return quiz;
}

function buscarQuizVisivel(banco, id, usuario) {
  const quiz = buscarQuiz(banco, id);
  if (!podeVer(quiz, usuario)) throw naoEncontrado("Quiz não encontrado");
  return quiz;
}

function validarQuestoes(validacao, questoes) {
  questoes.forEach((questao, indice) => {
    const prefixo = `questoes[${indice}]`;
    const alternativas = Array.isArray(questao?.alternativas) ? questao.alternativas : [];
    validacao
      .exigir(preenchido(questao?.enunciado), `${prefixo}.enunciado`, "Informe o enunciado da pergunta")
      .exigir(cabe(questao?.enunciado, 250), `${prefixo}.enunciado`, "O enunciado deve ter no máximo 250 caracteres")
      .exigir(semMarcacao(questao?.enunciado), `${prefixo}.enunciado`, MENSAGEM_SEM_MARCACAO)
      .exigir(cabe(questao?.explicacao, 500), `${prefixo}.explicacao`, "A explicação deve ter no máximo 500 caracteres")
      .exigir(semMarcacao(questao?.explicacao), `${prefixo}.explicacao`, MENSAGEM_SEM_MARCACAO)
      .exigir(
        alternativas.length >= 2 && alternativas.length <= 5,
        `${prefixo}.alternativas`,
        "Cada pergunta deve ter de 2 a 5 alternativas",
      )
      .exigir(
        alternativas.filter((alternativa) => alternativa?.correta === true).length === 1,
        `${prefixo}.umaAlternativaCorreta`,
        "Marque exatamente uma alternativa correta",
      );
    alternativas.forEach((alternativa, posicao) => {
      const campo = `${prefixo}.alternativas[${posicao}].texto`;
      validacao
        .exigir(preenchido(alternativa?.texto), campo, "Informe o texto da alternativa")
        .exigir(cabe(alternativa?.texto, 100), campo, "A alternativa deve ter no máximo 100 caracteres")
        .exigir(semMarcacao(alternativa?.texto), campo, MENSAGEM_SEM_MARCACAO);
    });
  });
}

function validarQuiz(banco, corpo) {
  const artigos = Array.isArray(corpo.artigos) ? corpo.artigos : [];
  const questoes = Array.isArray(corpo.questoes) ? corpo.questoes : [];

  const validacao = criarValidacao()
    .exigir(preenchido(corpo.titulo), "titulo", "Informe o título")
    .exigir(cabe(corpo.titulo, 150), "titulo", "O título deve ter no máximo 150 caracteres")
    .exigir(semMarcacao(corpo.titulo), "titulo", MENSAGEM_SEM_MARCACAO)
    .exigir(preenchido(corpo.descricao), "descricao", "Informe a descrição")
    .exigir(cabe(corpo.descricao, 500), "descricao", "A descrição deve ter no máximo 500 caracteres")
    .exigir(semMarcacao(corpo.descricao), "descricao", MENSAGEM_SEM_MARCACAO)
    .exigir(Object.hasOwn(CATEGORIAS, corpo.categoria ?? ""), "categoria", "Informe a categoria")
    .exigir(Object.hasOwn(NIVEIS, corpo.nivel ?? ""), "nivel", "Informe o nível")
    .exigir(artigos.length <= 10, "artigos", "Indique no máximo 10 artigos")
    .exigir(questoes.length >= 3 && questoes.length <= 10, "questoes", "O quiz deve ter de 3 a 10 perguntas");
  validarQuestoes(validacao, questoes);
  validacao.concluir();

  if (new Set(artigos).size !== artigos.length) throw erroDeRegra("Não repita artigos na leitura sugerida");
  const publicados = new Set(
    banco.artigos.filter((artigo) => PUBLICADOS.includes(artigo.status)).map((artigo) => artigo.id),
  );
  if (!artigos.every((artigoId) => publicados.has(artigoId))) throw erroDeRegra("Indique só artigos publicados");

  return {
    titulo: corpo.titulo.trim(),
    descricao: corpo.descricao.trim(),
    categoria: corpo.categoria,
    nivel: corpo.nivel,
    artigoIds: artigos,
    questoes: questoes.map((questao) => ({
      id: crypto.randomUUID(),
      enunciado: questao.enunciado.trim(),
      explicacao: aparado(questao.explicacao),
      alternativas: questao.alternativas.map((alternativa) => ({
        id: crypto.randomUUID(),
        texto: alternativa.texto.trim(),
        correta: alternativa.correta === true,
      })),
    })),
  };
}

function conferirRespostas(quiz, respostas) {
  if (!Array.isArray(respostas) || respostas.length === 0) throw erroDeRegra("Responda todas as perguntas");

  const escolhas = new Map();
  respostas.forEach((resposta) => {
    if (escolhas.has(resposta?.questaoId)) throw erroDeRegra("Responda cada pergunta uma única vez");
    escolhas.set(resposta?.questaoId, resposta?.alternativaId);
  });

  const idsDasQuestoes = new Set(quiz.questoes.map((questao) => questao.id));
  if (![...escolhas.keys()].every((id) => idsDasQuestoes.has(id))) {
    throw erroDeRegra("Responda cada pergunta uma única vez");
  }
  if (escolhas.size !== idsDasQuestoes.size) throw erroDeRegra("Responda todas as perguntas");

  quiz.questoes.forEach((questao) => {
    const escolhida = escolhas.get(questao.id);
    if (!questao.alternativas.some((alternativa) => alternativa.id === escolhida)) {
      throw erroDeRegra("A alternativa escolhida não pertence à pergunta");
    }
  });

  return escolhas;
}

export const manipuladoresDeQuizzes = [
  http.get(
    "/api/quizzes/pendentes",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "ADMINISTRADOR");
      const pendentes = banco.quizzes.filter((quiz) => quiz.status === "PENDENTE");
      return ordenarPorCriacao(pendentes, true).map((quiz) => paraResumo(banco, quiz, usuario));
    }),
  ),

  http.get(
    "/api/quizzes/minhas-tentativas",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      return banco.tentativas
        .filter((tentativa) => tentativa.usuarioId === usuario.id)
        .sort((a, b) => a.feitaEm.localeCompare(b.feitaEm))
        .map((tentativa) => ({
          quiz: banco.quizzes.find((quiz) => quiz.id === tentativa.quizId)?.titulo ?? "Quiz excluído",
          acertos: tentativa.acertos,
          total: tentativa.total,
          percentual: percentual(tentativa.acertos, tentativa.total),
          feitaEm: tentativa.feitaEm,
        }));
    }),
  ),

  http.get(
    "/api/quizzes/meus/desempenho",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "PROFESSOR");
      return ordenarPorCriacao(banco.quizzes.filter((quiz) => quiz.autorId === usuario.id), true)
        .map((quiz) => {
          const tentativas = banco.tentativas.filter(
            (tentativa) => tentativa.quizId === quiz.id && tentativa.usuarioId !== usuario.id,
          );
          const media = tentativas.length
            ? tentativas.reduce((soma, tentativa) => soma + percentual(tentativa.acertos, tentativa.total), 0) /
              tentativas.length
            : 0;
          return { quiz: quiz.titulo, tentativas: tentativas.length, notaMedia: Math.round(media) };
        })
        .filter((desempenho) => desempenho.tentativas > 0);
    }),
  ),

  http.get(
    "/api/quizzes",
    rota(({ request, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      return ordenarPorCriacao(banco.quizzes.filter((quiz) => podeVer(quiz, usuario))).map((quiz) =>
        paraResumo(banco, quiz, usuario),
      );
    }),
  ),

  http.get(
    "/api/quizzes/:id/edicao",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      const quiz = buscarQuiz(banco, params.id);
      exigirAutorOuAdministrador(quiz, usuario);
      return {
        id: quiz.id,
        titulo: quiz.titulo,
        descricao: quiz.descricao,
        categoria: quiz.categoria,
        nivel: quiz.nivel,
        artigos: [...quiz.artigoIds],
        questoes: quiz.questoes.map((questao) => ({
          enunciado: questao.enunciado,
          explicacao: questao.explicacao,
          alternativas: questao.alternativas.map(({ texto, correta }) => ({ texto, correta })),
        })),
      };
    }),
  ),

  http.get(
    "/api/quizzes/:id",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      return paraDetalhe(banco, buscarQuizVisivel(banco, params.id, usuario), usuario);
    }),
  ),

  http.post(
    "/api/quizzes",
    rota(({ request, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const dados = validarQuiz(banco, corpo);
      exigirVagaDoProfessor(banco.quizzes, usuario, "quizzes");

      const quiz = {
        id: crypto.randomUUID(),
        ...dados,
        autorId: usuario.id,
        status: usuario.papel === "ADMINISTRADOR" ? "APROVADO" : "PENDENTE",
        motivoRejeicao: null,
        criadoEm: agora(),
        atualizadoEm: null,
      };
      banco.quizzes.push(quiz);
      registrarAuditoria(banco, { acao: "CRIADO", recursoTipo: TIPO, recursoId: quiz.id, usuarioId: usuario.id });

      return HttpResponse.json(paraDetalhe(banco, quiz, usuario), { status: 201 });
    }),
  ),

  http.put(
    "/api/quizzes/:id",
    rota(({ request, params, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const quiz = buscarQuiz(banco, params.id);
      exigirAutorOuAdministrador(quiz, usuario);

      Object.assign(quiz, validarQuiz(banco, corpo), { atualizadoEm: agora() });
      if (usuario.papel !== "ADMINISTRADOR") voltarParaAnalise(banco, TIPO, quiz);
      registrarAuditoria(banco, { acao: "ATUALIZADO", recursoTipo: TIPO, recursoId: quiz.id, usuarioId: usuario.id });

      return paraDetalhe(banco, quiz, usuario);
    }),
  ),

  http.delete(
    "/api/quizzes/:id",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, ...EDITORES);
      const quiz = buscarQuiz(banco, params.id);
      exigirAutorOuAdministrador(quiz, usuario);

      banco.quizzes = banco.quizzes.filter((candidato) => candidato.id !== quiz.id);
      banco.tentativas = banco.tentativas.filter((tentativa) => tentativa.quizId !== quiz.id);
      removerAprovacoes(banco, TIPO, quiz.id);
      registrarAuditoria(banco, { acao: "EXCLUIDO", recursoTipo: TIPO, recursoId: quiz.id, usuarioId: usuario.id });
    }),
  ),

  http.post(
    "/api/quizzes/:id/aprovacoes",
    rota(({ request, params, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "PROFESSOR");
      const quiz = buscarQuiz(banco, params.id);
      aprovarComoProfessor(banco, TIPO, quiz, usuario, "um quiz");
      return paraDetalhe(banco, quiz, usuario);
    }),
  ),

  http.patch(
    "/api/quizzes/:id/status",
    rota(({ request, params, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      exigirPapel(usuario, "ADMINISTRADOR");
      const quiz = buscarQuiz(banco, params.id);
      decidirSituacao(banco, TIPO, quiz, corpo, usuario, "Este quiz já foi decidido");
      return paraDetalhe(banco, quiz, usuario);
    }),
  ),

  http.post(
    "/api/quizzes/:id/tentativas",
    rota(({ request, params, corpo, banco }) => {
      const usuario = usuarioAutenticado(request, banco);
      const quiz = buscarQuizVisivel(banco, params.id, usuario);
      if (!PUBLICADOS.includes(quiz.status)) throw conflito("Este quiz ainda não foi publicado");

      const escolhas = conferirRespostas(quiz, corpo.respostas);
      const correcao = quiz.questoes.map((questao) => {
        const correta = questao.alternativas.find((alternativa) => alternativa.correta);
        const escolhida = escolhas.get(questao.id);
        return {
          questaoId: questao.id,
          alternativaCorretaId: correta.id,
          alternativaEscolhidaId: escolhida,
          acertou: correta.id === escolhida,
          explicacao: questao.explicacao,
        };
      });

      const total = quiz.questoes.length;
      const acertos = correcao.filter((item) => item.acertou).length;
      banco.tentativas.push({
        id: crypto.randomUUID(),
        quizId: quiz.id,
        usuarioId: usuario.id,
        acertos,
        total,
        feitaEm: agora(),
      });

      return {
        acertos,
        total,
        percentual: percentual(acertos, total),
        concluido: concluido(acertos, total),
        notaMinima: NOTA_MINIMA,
        correcao,
      };
    }),
  ),
];
