export const PAPEIS = {
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  ADMINISTRADOR: "Administrador",
};

export const CATEGORIAS = {
  FISIOLOGIA: "Fisiologia",
  BIOMECANICA: "Biomecânica",
  PERIODIZACAO: "Periodização",
  NUTRICAO: "Nutrição",
};

export const NIVEIS = {
  INICIANTE: "Iniciante",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado",
};

export const GRUPOS_MUSCULARES = {
  PEITO: "Peito",
  COSTAS: "Costas",
  OMBRO: "Ombro",
  BICEPS: "Bíceps",
  TRICEPS: "Tríceps",
  PERNA: "Perna",
  GLUTEO: "Glúteo",
  ABDOMEN: "Abdômen",
};

export const NIVEIS_DE_ATIVIDADE = {
  SEDENTARIO: { descricao: "Sedentário, sem treino regular", fator: 1.2 },
  LEVE: { descricao: "Leve - 1 a 3 vezes por semana", fator: 1.375 },
  MODERADO: { descricao: "Moderado - 3 a 5 vezes por semana", fator: 1.55 },
  INTENSO: { descricao: "Intenso - 6 a 7 vezes por semana", fator: 1.725 },
  MUITO_INTENSO: { descricao: "Muito intenso - 2 treinos por dia", fator: 1.9 },
};

export const SEXOS = {
  MASCULINO: "Masculino",
  FEMININO: "Feminino",
};

export function listarOpcoes(mapa) {
  return Object.entries(mapa).map(([codigo, valor]) => ({
    codigo,
    descricao: typeof valor === "string" ? valor : valor.descricao,
  }));
}

export function opcao(mapa, codigo) {
  return { codigo, descricao: mapa[codigo] };
}
