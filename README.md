# MenteForte — Frontend

Projeto Final de Curso de Sistemas de Informação da UMC (2026), com conteúdo educacional sobre musculação para alunos, professores e administradores.

## Tecnologias e organização

React 19, React Compiler, React Router 7, Tailwind CSS 4, Axios, Recharts, Lucide, Fontsource (Inter e Montserrat), Vite 8 e ESLint 10. O compilador cuida da memoização; os componentes não usam `useMemo` ou `useCallback` manualmente.

- `src/main.jsx` e `src/App.jsx`: inicialização e rotas; as páginas secundárias são carregadas sob demanda com `lazy` e `Suspense`, e as rotas restritas ficam agrupadas sob `RotaProtegida` e `RotaPorPapel`.
- `src/index.css`: tokens de design (cores da marca, superfícies, texto, fontes e sombras) no `@theme` do Tailwind.
- `src/layout/`: navegação, menu da conta, rodapé, sessão e avisos globais.
- `src/pages/`: páginas públicas, conteúdo, calculadoras, conta e administração.
- `src/components/ui/`: base visual reutilizável (Botao, Campo, Cartao, Etiqueta, Alerta, Container, Carregando, EstadoRequisicao, CabecalhoPagina, Logo e Modal). O `Modal` usa o diálogo nativo do navegador, com foco preso, Escape e bloqueio do fundo.
- `src/components/`: formulários e componentes de cada área.
- `src/hooks/`: comportamento compartilhado, como cálculos e consulta de CEP que ignora respostas antigas.
- `src/services/`: toda comunicação HTTP com a API e alternativas locais de simulação existentes.
- `src/utils/`: formatação, sessão, papéis e constantes da interface.
- `public/images/`: imagens servidas diretamente pela aplicação.

## Funcionalidades e acesso

A home (`/`), a apresentação (`/about`), os termos (`/termos-de-uso`), a política (`/politica-de-privacidade`) e o cadastro (`/cadastro`) são públicos. O login abre em um modal da navegação; não existe rota `/login`.

Depois de entrar, o usuário acessa `/inicio`, artigos (`/articles` e `/articles/:id`), quizzes (`/quiz` e `/quiz/:id`), biblioteca de exercícios (`/library`), calculadoras e hidratação (`/progress`) e sua conta (`/minha-conta`). A criação e edição de conteúdo respeitam o papel e as permissões retornadas pela API. Os validadores acessam `/admin/usuarios`, `/admin/auditoria` e `/admin/pendentes`; `/admin` redireciona à gestão de usuários.

Professores têm limite de três itens de cada tipo aguardando a aprovação do administrador. Um conteúdo de professor é publicado com três aprovações de outros professores ou pela decisão do administrador.

## Modo de demonstração

Esta versão funciona sem backend. A pasta `src/demo/` simula a API REST dentro do navegador com o MSW (`defineNetwork` com interceptação de `fetch` e `XMLHttpRequest` na própria página), então os services e o Axios continuam fazendo chamadas HTTP normais para `/api`.

- `src/demo/manipuladores/`: uma rota simulada para cada endpoint, com as mesmas regras de visibilidade, aprovação, limite, quiz e cálculo do backend original.
- `src/demo/dados/`: contas de teste, artigos, quizzes, exercícios, tentativas, Termos de Uso e Política de Privacidade iniciais.
- `src/demo/banco.js`: os dados ficam no `localStorage`; as senhas são guardadas como SHA-256 com sal por conta.
- O botão **Restaurar dados da demonstração**, no rodapé, apaga tudo e volta ao conteúdo inicial.

Contas de teste (senha `menteforte`): `aluno@menteforte.example`, `professor@menteforte.example` e `admin@menteforte.example`. O modal de login tem um botão de um clique para cada uma.

O login é propositalmente simples: sem código por e-mail, senha de no mínimo 6 caracteres e escolha livre do perfil no cadastro. O aceite dos Termos só é liberado depois que eles são abertos.

## Execução e verificação

Com Node instalado, rode `npm install` e depois `npm run dev`, `npm run lint` e `npm run build`. Não há variáveis de ambiente.
