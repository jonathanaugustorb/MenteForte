import { acessoNegado, conflito } from "./erros";
import { cabe, criarValidacao, MENSAGEM_SEM_MARCACAO, preenchido, semMarcacao } from "./validacao";
import { registrarAuditoria } from "./auditoria";
import { agora } from "./tempo";

export const APROVACOES_NECESSARIAS = 3;
export const LIMITE_AGUARDANDO = 3;
export const PUBLICADOS = ["APROVADO", "APROVADO_PELOS_PROFESSORES"];
export const EM_ANALISE = ["PENDENTE", "APROVADO_PELOS_PROFESSORES"];
export const EDITORES = ["PROFESSOR", "ADMINISTRADOR"];

const STATUS_VISIVEIS = {
  ADMINISTRADOR: ["PENDENTE", "APROVADO_PELOS_PROFESSORES", "APROVADO", "REJEITADO"],
  PROFESSOR: ["PENDENTE", "APROVADO_PELOS_PROFESSORES", "APROVADO"],
  ALUNO: PUBLICADOS,
};

export function nomeDoUsuario(banco, usuarioId) {
  return banco.usuarios.find((usuario) => usuario.id === usuarioId)?.nomeCompleto ?? null;
}

export function aprovacoesDe(banco, tipo, itemId) {
  return banco.aprovacoes.filter((aprovacao) => aprovacao.tipo === tipo && aprovacao.itemId === itemId);
}

export function removerAprovacoes(banco, tipo, itemId) {
  banco.aprovacoes = banco.aprovacoes.filter(
    (aprovacao) => !(aprovacao.tipo === tipo && aprovacao.itemId === itemId),
  );
}

export function podeVer(item, usuario) {
  if (STATUS_VISIVEIS[usuario.papel].includes(item.status)) return true;
  return item.status === "REJEITADO" && item.autorId === usuario.id;
}

export function exigirAutorOuAdministrador(item, usuario) {
  if (usuario.papel === "ADMINISTRADOR") return;
  if (item.autorId !== usuario.id) throw acessoNegado();
}

export function exigirVagaDoProfessor(itens, usuario, nomeNoPlural) {
  if (usuario.papel !== "PROFESSOR") return;
  const aguardando = itens.filter((item) => item.autorId === usuario.id && item.status !== "APROVADO");
  if (aguardando.length >= LIMITE_AGUARDANDO) {
    throw conflito(
      `Você atingiu o limite de ${LIMITE_AGUARDANDO} ${nomeNoPlural} aguardando a aprovação do administrador. Aguarde uma aprovação para criar outro.`,
    );
  }
}

export function camposDeModeracao(banco, tipo, item, usuario) {
  const aprovacoes = aprovacoesDe(banco, tipo, item.id);
  const administrador = usuario.papel === "ADMINISTRADOR";
  const autor = item.autorId === usuario.id;
  const jaAprovou = aprovacoes.some((aprovacao) => aprovacao.professorId === usuario.id);

  return {
    autorNome: item.autorId ? nomeDoUsuario(banco, item.autorId) : null,
    status: item.status,
    motivoRejeicao: autor || administrador ? item.motivoRejeicao : null,
    aprovacoesDeProfessores: aprovacoes.length,
    aprovacoesNecessarias: APROVACOES_NECESSARIAS,
    podeEditar: autor || administrador,
    podeAprovar: usuario.papel === "PROFESSOR" && !autor && item.status === "PENDENTE" && !jaAprovou,
    professoresQueAprovaram: administrador
      ? aprovacoes.map((aprovacao) => nomeDoUsuario(banco, aprovacao.professorId))
      : [],
    criadoEm: item.criadoEm,
  };
}

export function voltarParaAnalise(banco, tipo, item) {
  item.status = "PENDENTE";
  item.motivoRejeicao = null;
  item.atualizadoEm = agora();
  removerAprovacoes(banco, tipo, item.id);
}

export function aprovarComoProfessor(banco, tipo, item, usuario, artigoDoTipo) {
  if (item.autorId === usuario.id) throw acessoNegado();
  if (item.status !== "PENDENTE") {
    throw conflito(`Só é possível aprovar ${artigoDoTipo} que está pendente`);
  }
  if (aprovacoesDe(banco, tipo, item.id).some((aprovacao) => aprovacao.professorId === usuario.id)) {
    throw conflito("Você já aprovou este conteúdo");
  }

  banco.aprovacoes.push({ tipo, itemId: item.id, professorId: usuario.id, aprovadoEm: agora() });
  registrarAuditoria(banco, { acao: "APROVADO", recursoTipo: tipo, recursoId: item.id, usuarioId: usuario.id });

  if (aprovacoesDe(banco, tipo, item.id).length >= APROVACOES_NECESSARIAS) {
    item.status = "APROVADO_PELOS_PROFESSORES";
  }
}

export function validarDecisao(corpo) {
  const rejeitado = corpo.status === "REJEITADO";
  criarValidacao()
    .exigir(["APROVADO", "REJEITADO"].includes(corpo.status), "status", "A situação deve ser Aprovado ou Rejeitado")
    .exigir(!rejeitado || preenchido(corpo.motivo), "motivo", "Informe o motivo da rejeição")
    .exigir(cabe(corpo.motivo, 500), "motivo", "O motivo deve ter no máximo 500 caracteres")
    .exigir(semMarcacao(corpo.motivo), "motivo", MENSAGEM_SEM_MARCACAO)
    .concluir();
  return rejeitado;
}

export function decidirSituacao(banco, tipo, item, corpo, usuario, mensagemJaDecidido) {
  if (!EM_ANALISE.includes(item.status)) throw conflito(mensagemJaDecidido);
  const rejeitado = validarDecisao(corpo);
  item.status = corpo.status;
  item.motivoRejeicao = rejeitado ? corpo.motivo.trim() : null;
  registrarAuditoria(banco, {
    acao: rejeitado ? "REJEITADO" : "APROVADO",
    recursoTipo: tipo,
    recursoId: item.id,
    usuarioId: usuario.id,
  });
  return rejeitado;
}

export function ordenarPorCriacao(itens, crescente = false) {
  return [...itens].sort((a, b) =>
    crescente ? a.criadoEm.localeCompare(b.criadoEm) : b.criadoEm.localeCompare(a.criadoEm),
  );
}
