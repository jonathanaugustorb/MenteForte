import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import Cartao from "../components/ui/Cartao";
import Etiqueta from "../components/ui/Etiqueta";
import { estiloDeBotao } from "../components/ui/estiloDeBotao";
import EstadoRequisicao from "../components/ui/EstadoRequisicao";
import { etiquetaDoArtigo, STATUS_ARTIGO } from "../components/ArticlesComponents/artigoCampos";
import { listarArtigos } from "../services/artigoService";
import { listarExercicios } from "../services/exercicioService";
import { listarQuizzes } from "../services/quizService";
import { formatarDataCurta } from "../utils/formatar";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import { subtituloPorPapel } from "../utils/subtitulosDasPaginas";

const GRUPOS = [
  {
    chave: "pendentes",
    titulo: "Aguardando aprovação",
    status: ["PENDENTE"],
    vazio: "Você não tem nada esperando aprovação.",
  },
  {
    chave: "publicados",
    titulo: "Publicados",
    status: ["APROVADO", "APROVADO_PELOS_PROFESSORES"],
    vazio: "Você ainda não tem conteúdo publicado.",
  },
  {
    chave: "recusados",
    titulo: "Recusados",
    status: ["REJEITADO"],
    vazio: "Nenhum conteúdo seu foi recusado.",
  },
];

function normalizar(lista, usuario, tipo, endereco) {
  return (lista ?? [])
    .filter((item) => item.podeEditar && item.autorNome === usuario?.nomeCompleto)
    .map((item) => ({
      chave: `${tipo}-${item.id}`,
      titulo: item.titulo ?? item.nome,
      tipo,
      endereco: endereco(item),
      status: item.status,
      motivoRejeicao: item.motivoRejeicao,
      aprovacoesDeProfessores: item.aprovacoesDeProfessores,
      aprovacoesNecessarias: item.aprovacoesNecessarias,
      criadoEm: item.criadoEm,
    }));
}

const TOM_DA_SITUACAO = {
  PENDENTE: "aviso",
  APROVADO: "sucesso",
  APROVADO_PELOS_PROFESSORES: "sucesso",
  REJEITADO: "perigo",
};

function Item({ item }) {
  return (
    <Cartao className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Etiqueta tom="marca">{item.tipo}</Etiqueta>
        <Etiqueta tom={TOM_DA_SITUACAO[item.status] ?? "neutra"}>
          {etiquetaDoArtigo(item) ?? STATUS_ARTIGO[item.status]?.descricao}
        </Etiqueta>
      </div>

      <h3 className="font-titulo text-lg leading-snug font-bold text-texto wrap-break-word">{item.titulo}</h3>
      <p className="text-xs text-texto-fraco">Criado em {formatarDataCurta(item.criadoEm)}</p>

      {item.motivoRejeicao && (
        <p className="rounded-lg bg-perigo/10 p-3 text-sm text-red-100 wrap-break-word">
          <span className="font-semibold">Motivo da recusa: </span>
          {item.motivoRejeicao}
        </p>
      )}

      <div className="mt-auto pt-2">
        <Link to={item.endereco} className={estiloDeBotao({ variante: "secundario", tamanho: "pequeno" })}>
          Abrir
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </Cartao>
  );
}

function Grupo({ grupo, itens }) {
  const doGrupo = itens.filter((item) => grupo.status.includes(item.status));

  return (
    <section>
      <h2 className="flex items-center gap-2 font-titulo text-xl font-bold text-texto">
        {grupo.titulo}
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-semibold text-texto-suave">{doGrupo.length}</span>
      </h2>

      {doGrupo.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doGrupo.map((item) => (
            <Item key={item.chave} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-texto-fraco">{grupo.vazio}</p>
      )}
    </section>
  );
}

function MeuAcervoPages() {
  const { usuario } = useOutletContext();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarExercicios(), listarArtigos(), listarQuizzes()])
      .then(([exercicios, artigos, quizzes]) => {
        if (ativo) setDados({ exercicios, artigos, quizzes });
      })
      .catch((falha) => {
        if (ativo) setErro(falha?.mensagem ?? "Não foi possível carregar o seu acervo.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const itens = dados
    ? [
        ...normalizar(
          dados.exercicios,
          usuario,
          "Exercício",
          (item) => `/library?exercicio=${item.id}`,
        ),
        ...normalizar(dados.artigos, usuario, "Artigo", (item) => `/articles/${item.id}`),
        ...normalizar(dados.quizzes, usuario, "Quiz", (item) => `/quiz/${item.id}`),
      ]
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
      <CabecalhoPagina
        titulo="Meu acervo"
        subtitulo={subtituloPorPapel("meuAcervo", usuario?.papel)}
        icone={ICONES_DAS_PAGINAS.meuAcervo}
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando o seu acervo..."
        erro={erro}
      >
        <div className="flex flex-col gap-10">
          {GRUPOS.map((grupo) => (
            <Grupo key={grupo.chave} grupo={grupo} itens={itens} />
          ))}
        </div>
      </EstadoRequisicao>
    </div>
  );
}

export default MeuAcervoPages;
