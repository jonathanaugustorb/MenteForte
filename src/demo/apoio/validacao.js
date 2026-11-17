import { dadosInvalidos } from "./erros";

const ABERTURA_DE_TAG = /<[a-zA-Z/!?]/;
const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MENSAGEM_SEM_MARCACAO = "Não use marcação HTML neste campo";

export function preenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

export function aparado(valor) {
  if (typeof valor !== "string") return null;
  const limpo = valor.trim();
  return limpo === "" ? null : limpo;
}

export function cabe(valor, maximo) {
  return valor == null || String(valor).length <= maximo;
}

export function semMarcacao(valor) {
  return valor == null || !ABERTURA_DE_TAG.test(valor);
}

export function ehEmail(valor) {
  return typeof valor === "string" && FORMATO_DE_EMAIL.test(valor.trim());
}

export function normalizarEmail(valor) {
  return typeof valor === "string" ? valor.trim().toLowerCase() : "";
}

export function criarValidacao() {
  const campos = [];

  return {
    exigir(condicao, campo, mensagem) {
      if (!condicao && !campos.some((item) => item.campo === campo)) {
        campos.push({ campo, mensagem });
      }
      return this;
    },
    concluir() {
      if (campos.length > 0) throw dadosInvalidos(campos);
    },
  };
}
