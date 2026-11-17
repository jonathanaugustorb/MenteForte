import { BookOpen, Dumbbell, HeartHandshake, LockKeyhole, ShieldCheck, Wallet } from "lucide-react";
import { ICONES_DAS_PAGINAS } from "../../utils/iconesDasPaginas";

export const RECURSOS = [
  {
    icone: ICONES_DAS_PAGINAS.artigos,
    titulo: "Artigos",
    texto: "Resumos de estudos sobre fisiologia, biomecânica, periodização e nutrição, revisados por professores.",
  },
  {
    icone: ICONES_DAS_PAGINAS.biblioteca,
    titulo: "Biblioteca de exercícios",
    texto: "A execução de cada exercício passo a passo, os erros mais comuns e o aquecimento recomendado.",
  },
  {
    icone: ICONES_DAS_PAGINAS.quiz,
    titulo: "Quizzes",
    texto: "Perguntas sobre o que você leu, com a correção na hora e a sua melhor nota guardada.",
  },
  {
    icone: ICONES_DAS_PAGINAS.calculadoras,
    titulo: "Calculadoras",
    texto: "Volume de treino, gasto energético e hidratação, cada uma com o cálculo explicado.",
  },
];

export const ETAPAS_DE_PUBLICACAO = [
  {
    titulo: "O professor escreve",
    texto: "Um profissional de Educação Física envia o artigo, o quiz ou o exercício, sempre indicando a fonte.",
  },
  {
    titulo: "Os colegas revisam",
    texto: "Com a aprovação de três outros professores, o conteúdo passa a aparecer no site.",
  },
  {
    titulo: "O administrador decide",
    texto: "A decisão final confirma a publicação ou devolve o conteúdo com o motivo da rejeição.",
  },
];

export const PERFIS = [
  {
    papel: "ALUNO",
    icone: BookOpen,
    titulo: "Aluno",
    texto: "Lê os artigos, consulta a biblioteca, responde aos quizzes e acompanha as notas e o treino.",
  },
  {
    papel: "PROFESSOR",
    icone: Dumbbell,
    titulo: "Professor",
    texto: "Escreve artigos, quizzes e exercícios e revisa o conteúdo dos colegas antes da publicação.",
  },
  {
    papel: "ADMINISTRADOR",
    icone: ShieldCheck,
    titulo: "Administrador",
    texto: "Decide o que é publicado, cuida das contas, atende os pedidos de exclusão e consulta a auditoria.",
  },
];

export const COMPROMISSOS = [
  {
    icone: HeartHandshake,
    titulo: "Conteúdo educativo",
    texto: "O MenteForte ensina, mas não substitui a avaliação de um profissional de Educação Física ou de saúde.",
  },
  {
    icone: Wallet,
    titulo: "Uso gratuito",
    texto: "Não há cobrança, assinatura nem conteúdo pago.",
  },
  {
    icone: LockKeyhole,
    titulo: "Seus dados com você",
    texto: "Nesta versão de demonstração, tudo fica guardado só no seu navegador.",
  },
];
