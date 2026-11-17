import { agora } from "./tempo";

export const ACOES_DE_AUDITORIA = [
  { codigo: "CRIADO", descricao: "Criado" },
  { codigo: "LIDO", descricao: "Lido" },
  { codigo: "ATUALIZADO", descricao: "Atualizado" },
  { codigo: "EXCLUIDO", descricao: "Excluído" },
  { codigo: "LOGIN_REALIZADO", descricao: "Login realizado" },
  { codigo: "LOGIN_FALHOU", descricao: "Falha no login" },
  { codigo: "SENHA_FALHOU", descricao: "Senha atual errada" },
  { codigo: "ANONIMIZADO", descricao: "Conta anonimizada" },
  { codigo: "APROVADO", descricao: "Aprovado" },
  { codigo: "REJEITADO", descricao: "Rejeitado" },
  { codigo: "DADO_COMPLETO_LIDO", descricao: "Dados completos abertos" },
];

export const RECURSOS_DE_AUDITORIA = [
  { codigo: "USUARIO", descricao: "Usuário" },
  { codigo: "EXERCICIO", descricao: "Exercício" },
  { codigo: "AUDITORIA", descricao: "Trilha de auditoria" },
  { codigo: "ARTIGO", descricao: "Artigo" },
  { codigo: "QUIZ", descricao: "Quiz" },
];

export function registrarAuditoria(
  banco,
  { acao, recursoTipo, recursoId = null, usuarioId = null, justificativa = null, ocorridoEm = agora() },
) {
  banco.auditoria.push({
    id: crypto.randomUUID(),
    ocorridoEm,
    acao,
    recursoTipo,
    recursoId,
    usuarioId,
    justificativa,
  });
}
