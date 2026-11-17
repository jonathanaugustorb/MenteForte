function questao(enunciado, correta, erradas, explicacao) {
  const alternativas = erradas.map((texto) => ({ texto, correta: false }));
  const posicaoDaCorreta = enunciado.length % (erradas.length + 1);
  alternativas.splice(posicaoDaCorreta, 0, { texto: correta, correta: true });
  return { enunciado, explicacao, alternativas };
}

export const QUIZZES = {
  progressao: {
    titulo: "Fundamentos da progressão de carga",
    descricao: "Teste o que você aprendeu sobre sobrecarga progressiva e sobre como aumentar a carga com segurança.",
    categoria: "PERIODIZACAO",
    nivel: "INICIANTE",
    artigos: ["progressao"],
    autor: "ana",
    status: "APROVADO",
    criadoHaDias: 38,
    questoes: [
      questao(
        "O que é sobrecarga progressiva?",
        "Aumentar aos poucos a exigência do treino",
        ["Treinar sempre até a exaustão", "Trocar todos os exercícios toda semana"],
        "A adaptação continua quando o treino fica um pouco mais exigente com o tempo: mais carga, mais repetições ou mais séries.",
      ),
      questao(
        "Segundo o ACSM, quando vale aumentar a carga de um exercício?",
        "Quando você faz uma ou duas repetições além do planejado em duas sessões seguidas",
        ["Toda semana, sem exceção", "Só depois de seis meses de treino"],
        "O posicionamento sugere aumentos de 2 a 10% quando a carga atual já ficou fácil em duas sessões seguidas.",
      ),
      questao(
        "Qual faixa de repetições o ACSM sugere para iniciantes?",
        "De 8 a 12 repetições",
        ["De 1 a 3 repetições", "De 25 a 30 repetições"],
        "Cargas moderadas, de 8 a 12 repetições, equilibram técnica, segurança e estímulo para quem está começando.",
      ),
      questao(
        "Quantas vezes por semana o iniciante deve treinar, segundo o posicionamento?",
        "De duas a três vezes",
        ["Uma vez a cada quinze dias", "Todos os dias, sem descanso"],
        "Duas ou três sessões semanais dão estímulo suficiente e tempo para recuperar.",
      ),
    ],
  },
  volume: {
    titulo: "Volume, carga e hipertrofia",
    descricao: "Perguntas sobre quantas séries fazer por semana e sobre a escolha entre cargas altas e baixas.",
    categoria: "FISIOLOGIA",
    nivel: "INTERMEDIARIO",
    artigos: ["volume", "cargas"],
    autor: "professor",
    status: "APROVADO",
    criadoHaDias: 30,
    questoes: [
      questao(
        "O que a metanálise sobre volume semanal encontrou?",
        "Mais séries semanais estiveram associadas a mais hipertrofia",
        ["O volume não influencia o ganho de massa", "Menos de cinco séries semanais deram os maiores ganhos"],
        "Os autores encontraram uma relação de dose e resposta entre as séries semanais e o ganho de massa muscular.",
      ),
      questao(
        "Treinando perto da falha, como foi a hipertrofia com cargas baixas e altas?",
        "Parecida nos dois casos",
        ["Muito maior com cargas baixas", "Nenhuma com cargas altas"],
        "Com esforço alto, as duas faixas de carga produziram hipertrofia semelhante.",
      ),
      questao(
        "Quem quer aumentar a força máxima em um movimento deve:",
        "Incluir cargas altas no treino",
        ["Usar só cargas muito leves", "Evitar treinar esse movimento"],
        "A força máxima aumentou mais nos grupos que treinaram com cargas altas.",
      ),
      questao(
        "Qual o cuidado ao aumentar o volume de treino?",
        "Aumentar aos poucos, respeitando a recuperação",
        ["Dobrar as séries de uma vez", "Ignorar dores e cansaço"],
        "Volume demais, cedo demais, atrapalha a recuperação e aumenta o risco de lesão.",
      ),
    ],
  },
  nutricao: {
    titulo: "Nutrição e hidratação para quem treina",
    descricao: "Um quiz rápido sobre proteína ao longo do dia e reposição de líquidos no exercício.",
    categoria: "NUTRICAO",
    nivel: "INICIANTE",
    artigos: ["proteina", "hidratacao"],
    autor: "carla",
    status: "APROVADO",
    criadoHaDias: 22,
    questoes: [
      questao(
        "Qual ingestão diária de proteína a ISSN considera suficiente para a maioria de quem treina?",
        "De 1,4 a 2,0 g por quilo de peso",
        ["De 0,2 a 0,4 g por quilo de peso", "Mais de 5 g por quilo de peso"],
        "Essa faixa basta para construir e manter massa muscular na maior parte das pessoas que treinam.",
      ),
      questao(
        "Como a ISSN sugere distribuir a proteína?",
        "Em refeições com cerca de 20 a 40 g ao longo do dia",
        ["Toda em uma única refeição", "Só logo depois do treino"],
        "Dividir a proteína em várias refeições ajuda a manter a síntese muscular ao longo do dia.",
      ),
      questao(
        "A partir de qual perda de peso pelo suor o desempenho já pode cair?",
        "Mais de 2% do peso corporal",
        ["Qualquer perda, por menor que seja", "Só acima de 15% do peso corporal"],
        "O ACSM recomenda evitar perdas maiores que 2% do peso corporal durante o exercício.",
      ),
      questao(
        "Qual a forma prática de conhecer a sua perda de líquido no treino?",
        "Pesar-se antes e depois do treino",
        ["Contar os copos de água do dia anterior", "Medir a frequência cardíaca em repouso"],
        "A diferença de peso antes e depois do treino mostra quanto líquido você perdeu.",
      ),
    ],
  },
  agachamento: {
    titulo: "Biomecânica do agachamento",
    descricao: "O que acontece com o joelho no agachamento e quais cuidados tornam o exercício seguro.",
    categoria: "BIOMECANICA",
    nivel: "INTERMEDIARIO",
    artigos: ["joelho"],
    autor: "bruno",
    status: "PENDENTE",
    aprovadoPor: ["ana"],
    criadoHaDias: 4,
    questoes: [
      questao(
        "Em pessoas saudáveis e com boa técnica, o agachamento compromete a estabilidade do joelho?",
        "Não",
        ["Sim, sempre", "Só quando a carga é leve"],
        "A revisão concluiu que o agachamento bem executado não compromete a estabilidade do joelho saudável.",
      ),
      questao(
        "O que acontece com as forças no joelho conforme ele dobra mais?",
        "Elas aumentam",
        ["Elas desaparecem", "Elas ficam sempre iguais"],
        "As forças sobre ligamentos e articulação crescem com a flexão do joelho.",
      ),
      questao(
        "Qual cuidado torna o agachamento mais seguro?",
        "Controlar a descida e progredir a carga aos poucos",
        ["Descer o mais rápido possível", "Tirar os calcanhares do chão"],
        "Controle, pés bem apoiados e progressão gradual são os cuidados destacados pelo autor.",
      ),
    ],
  },
};

export const TENTATIVAS = [
  { pessoa: "aluno", quiz: "progressao", acertos: 2, haDias: 26 },
  { pessoa: "aluno", quiz: "progressao", acertos: 3, haDias: 19 },
  { pessoa: "aluno", quiz: "volume", acertos: 2, haDias: 14 },
  { pessoa: "aluno", quiz: "progressao", acertos: 4, haDias: 9 },
  { pessoa: "aluno", quiz: "nutricao", acertos: 3, haDias: 5 },
  { pessoa: "aluno", quiz: "volume", acertos: 4, haDias: 2 },
  { pessoa: "juliana", quiz: "volume", acertos: 2, haDias: 12 },
  { pessoa: "juliana", quiz: "volume", acertos: 3, haDias: 6 },
  { pessoa: "juliana", quiz: "nutricao", acertos: 4, haDias: 4 },
  { pessoa: "pedro", quiz: "volume", acertos: 3, haDias: 8 },
  { pessoa: "pedro", quiz: "progressao", acertos: 3, haDias: 3 },
  { pessoa: "rafael", quiz: "nutricao", acertos: 2, haDias: 16 },
];
