function doisDigitos(numero) {
  return String(numero).padStart(2, "0");
}

export function formatarData(data) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

export function formatarDataHora(data) {
  const hora = `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}`;
  return `${formatarData(data)}T${hora}`;
}

export function agora() {
  return formatarDataHora(new Date());
}

export function hoje() {
  return formatarData(new Date());
}

export function momentoHaDias(dias, hora = 10, minuto = 0) {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  data.setHours(hora, minuto, 0, 0);
  return formatarDataHora(data);
}

export function dataHaDias(dias) {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return formatarData(data);
}

export function anoAtual() {
  return new Date().getFullYear();
}
