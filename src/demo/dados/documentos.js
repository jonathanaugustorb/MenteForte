import { EMAIL_CONTATO } from "../../utils/contato";

const VIGENTE_DESDE = "2026-11-16T00:00:00";
const VERSAO = "1.0";

const TERMOS_DE_USO = [
  {
    titulo: "1. O que é o MenteForte",
    paragrafos: [
      "O MenteForte é uma plataforma educativa sobre musculação, com artigos, biblioteca de exercícios, quizzes e calculadoras de métricas de treino.",
      "É um projeto de estudo desenvolvido por Jonathan Augusto Rodrigues Barbosa, de uso gratuito e sem fins comerciais. É destinado a maiores de 18 anos.",
    ],
  },
  {
    titulo: "2. Esta é uma versão de demonstração",
    paragrafos: [
      "Esta versão funciona sem servidor: o próprio navegador simula a API e guarda os dados. O login não é real. Ele existe para que qualquer pessoa consiga testar, de forma rápida, os perfis de aluno, professor e administrador.",
      "Por isso o cadastro foi simplificado de propósito: não pedimos data de nascimento nem endereço, não há verificação de CREF nem código de confirmação por e-mail, a senha precisa ter só 6 caracteres e você mesmo escolhe o perfil da conta. Em uma versão real, essas etapas existiriam para proteger quem usa a plataforma.",
    ],
  },
  {
    titulo: "3. Não use dados reais",
    paragrafos: [
      "Use um nome e um e-mail fictícios. O e-mail não é verificado e nenhuma mensagem é enviada para ele.",
      "Não repita uma senha que você usa em outros serviços. Mesmo guardada como resumo criptográfico, ela fica no armazenamento deste navegador.",
    ],
  },
  {
    titulo: "4. Onde ficam os dados",
    paragrafos: [
      "Contas, conteúdos, respostas de quiz e registros de auditoria ficam somente no armazenamento local deste navegador. Nada é enviado a um servidor do MenteForte.",
      "Os dados somem se você limpar os dados do site no navegador. O botão Restaurar dados da demonstração, no rodapé, apaga tudo o que foi feito e volta ao conteúdo inicial. Quem usar este mesmo navegador também consegue ver os dados.",
    ],
  },
  {
    titulo: "5. Conteúdo educativo",
    paragrafos: [
      "Os artigos, quizzes e exercícios servem para estudo. Eles não substituem a avaliação nem o acompanhamento de um profissional de Educação Física ou de saúde. Antes de começar ou mudar um treino, procure orientação profissional.",
      "As calculadoras mostram estimativas obtidas por fórmulas conhecidas, como a de Mifflin-St Jeor. Os números não são diagnóstico nem prescrição.",
    ],
  },
  {
    titulo: "6. Perfis e publicação de conteúdo",
    paragrafos: [
      "Alunos leem os artigos, consultam a biblioteca, respondem aos quizzes e usam as calculadoras. Professores também criam artigos, quizzes e exercícios e revisam o conteúdo dos colegas. Administradores decidem a publicação, cuidam das contas e atendem os pedidos de exclusão.",
      "Um conteúdo enviado por professor só aparece no site depois de três aprovações de outros professores ou da decisão do administrador. Cada professor pode ter até três itens de cada tipo aguardando aprovação.",
    ],
  },
  {
    titulo: "7. Conduta",
    paragrafos: [
      "Não publique conteúdo ofensivo, discriminatório, ilegal ou copiado de outra pessoa sem indicar a fonte. O administrador pode rejeitar conteúdos e desativar contas que não respeitem estes termos.",
    ],
  },
  {
    titulo: "8. Mudanças e disponibilidade",
    paragrafos: [
      "Esta demonstração pode mudar ou sair do ar a qualquer momento, sem aviso. Quando estes termos mudarem, a nova versão aparece nesta página.",
    ],
  },
  {
    titulo: "9. Contato",
    paragrafos: [
      `Dúvidas sobre estes termos podem ser enviadas para ${EMAIL_CONTATO}, um endereço fictício desta demonstração.`,
    ],
  },
];

const POLITICA_DE_PRIVACIDADE = [
  {
    titulo: "1. Resumo",
    paragrafos: [
      "Nesta demonstração, todos os dados ficam somente no seu navegador. O MenteForte não tem servidor, não usa cookies de rastreamento e não usa ferramentas de análise de acesso.",
    ],
  },
  {
    titulo: "2. Quais dados são guardados",
    paragrafos: [
      "Conta: nome, e-mail, perfil escolhido e a senha, guardada como resumo criptográfico SHA-256 com um valor aleatório próprio de cada conta, nunca como texto.",
      "Uso: conteúdos que você criar, respostas e notas dos quizzes, consumo de água do dia e os registros da trilha de auditoria.",
    ],
  },
  {
    titulo: "3. Para que os dados são usados",
    paragrafos: [
      "Para o login de teste funcionar, para mostrar o seu progresso e para demonstrar as funções de moderação e de auditoria. Os dados não são vendidos, compartilhados nem enviados para fora deste navegador.",
    ],
  },
  {
    titulo: "4. Trilha de auditoria",
    paragrafos: [
      "Ações como entrar, criar, aprovar, rejeitar e abrir os dados completos de uma conta ficam registradas para que o administrador possa consultá-las. Nas listagens, o e-mail aparece mascarado.",
    ],
  },
  {
    titulo: "5. Vídeos do YouTube",
    paragrafos: [
      "Os vídeos dos exercícios só carregam quando você clica para assistir. A partir daí, o YouTube recebe dados do seu acesso, conforme a política de privacidade dele.",
    ],
  },
  {
    titulo: "6. Seus direitos",
    paragrafos: [
      "Em Minha conta, você pode corrigir seus dados, baixar uma cópia deles em JSON e pedir a exclusão da conta. O pedido é atendido por um administrador, que anonimiza a conta.",
      "Ao sair da conta, o consumo de água guardado neste navegador é apagado. Para apagar todo o resto, use Restaurar dados da demonstração, no rodapé, ou limpe os dados do site no navegador.",
    ],
  },
  {
    titulo: "7. Contato",
    paragrafos: [`Dúvidas sobre esta política podem ser enviadas para ${EMAIL_CONTATO}, um endereço fictício desta demonstração.`],
  },
];

export const DOCUMENTOS = [
  {
    tipo: "TERMOS_USO",
    descricaoTipo: "Termos de Uso",
    versao: VERSAO,
    texto: JSON.stringify(TERMOS_DE_USO),
    vigenteDesde: VIGENTE_DESDE,
  },
  {
    tipo: "POLITICA_PRIVACIDADE",
    descricaoTipo: "Política de Privacidade",
    versao: VERSAO,
    texto: JSON.stringify(POLITICA_DE_PRIVACIDADE),
    vigenteDesde: VIGENTE_DESDE,
  },
];
