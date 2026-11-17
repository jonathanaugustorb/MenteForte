const formatador = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 20,
});

export function formatarNumero(valor) {
  if (valor === null || valor === undefined || valor === "") return "--";

  const numero = Number(valor);
  if (Number.isNaN(numero)) return "--";

  return formatador.format(numero);
}

function somenteDigitos(valor) {
  if (valor === null || valor === undefined) return "";
  return String(valor).replace(/\D/g, "");
}

function paraData(valor) {
  const apenasData =
    typeof valor === "string" &&
    valor.length === 10 &&
    valor[4] === "-" &&
    valor[7] === "-";

  return apenasData ? new Date(`${valor}T00:00:00`) : new Date(valor);
}

export function formatarDataCurta(valor) {
  if (!valor) return "—";

  const data = paraData(valor);
  if (Number.isNaN(data.getTime())) return "—";

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatarDataExtenso(valor) {
  if (!valor) return "";

  const data = paraData(valor);
  if (Number.isNaN(data.getTime())) return "";

  return data.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


export function mascaraInteira(valor, digitos) {
  return somenteDigitos(valor)
    .replace(/^0+(?=\d)/, "")
    .slice(0, digitos);
}

export function mascaraDecimal(valor, inteiros, casas) {
  const texto = String(valor ?? "")
    .replace(/\./g, ",")
    .replace(/[^\d,]/g, "");
  const virgula = texto.indexOf(",");

  if (virgula < 0) return mascaraInteira(texto, inteiros);

  const parteInteira = mascaraInteira(texto.slice(0, virgula), inteiros);
  const parteDecimal = somenteDigitos(texto.slice(virgula + 1)).slice(0, casas);

  return `${parteInteira || "0"},${parteDecimal}`;
}

export function paraNumero(texto) {
  return Number(String(texto).replace(",", "."));
}