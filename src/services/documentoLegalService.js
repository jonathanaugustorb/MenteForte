import api from "./api";

function lerSecoes(texto) {
  try {
    const secoes = JSON.parse(texto);
    return Array.isArray(secoes) ? secoes : [];
  } catch {
    return [{ titulo: "Documento em preparação", paragrafos: [texto] }];
  }
}

function comSecoes(documento) {
  return { ...documento, secoes: lerSecoes(documento.texto) };
}

export async function buscarDocumento(tipo) {
  const { data } = await api.get(`/documentos-legais/${tipo}`);
  return comSecoes(data);
}

export async function listarDocumentos() {
  const { data } = await api.get("/documentos-legais");
  return data.map(comSecoes);
}
