export class ErroDaApi extends Error {
  constructor(status, mensagem, campos = []) {
    super(mensagem);
    this.status = status;
    this.campos = campos;
  }
}

export function erroDeRegra(mensagem) {
  return new ErroDaApi(400, mensagem);
}

export function dadosInvalidos(campos) {
  return new ErroDaApi(400, "Dados inválidos", campos);
}

export function naoAutenticado(mensagem = "Autenticação necessária: entre novamente para continuar") {
  return new ErroDaApi(401, mensagem);
}

export function acessoNegado() {
  return new ErroDaApi(403, "Acesso negado");
}

export function naoEncontrado(mensagem) {
  return new ErroDaApi(404, mensagem);
}

export function conflito(mensagem) {
  return new ErroDaApi(409, mensagem);
}
