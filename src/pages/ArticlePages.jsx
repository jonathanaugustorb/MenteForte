import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Alerta from "../components/ui/Alerta";
import Etiqueta from "../components/ui/Etiqueta";
import { estiloDeBotao } from "../components/ui/estiloDeBotao";
import Cartao from "../components/ui/Cartao";
import EstadoRequisicao from "../components/ui/EstadoRequisicao";
import ValidacaoArtigo from "../components/ArticlesComponents/ValidacaoArtigo";
import EditarArtigo from "../components/ArticlesComponents/EditarArtigo";
import ExcluirArtigo from "../components/ArticlesComponents/ExcluirArtigo";
import AprovarArtigo from "../components/ArticlesComponents/AprovarArtigo";
import { etiquetaDoArtigo } from "../components/ArticlesComponents/artigoCampos";
import { buscarArtigoPorId, listarCategorias } from "../services/artigoService";
import { podeValidar } from "../utils/papeis";

function ArticlePages() {
  const { id } = useParams();
  const { usuario, avisar } = useOutletContext();
  const navigate = useNavigate();
  const [artigo, setArtigo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([buscarArtigoPorId(id), listarCategorias()])
      .then(([dados, listaCategorias]) => {
        if (!ativo) return;
        setArtigo(dados);
        setCategorias(listaCategorias);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setArtigo(null);
        setErro(err.mensagem || "Não foi possível carregar o artigo.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
    });

    return () => {
      ativo = false;
    };
  }, [id, usuario]);

  function aoEditar(atualizado) {
    setArtigo(atualizado);
    avisar({
      tipo: "sucesso",
      titulo: "Artigo atualizado",
      mensagem:
        atualizado.status === "PENDENTE"
          ? "As alterações foram salvas. O artigo aparece no site depois de aprovado."
          : "As alterações foram salvas.",
    });
  }

  function aoAprovar(atualizado) {
    setArtigo(atualizado);
    avisar({
      tipo: "sucesso",
      titulo: "Aprovação registrada",
      mensagem:
        atualizado.status === "APROVADO_PELOS_PROFESSORES"
          ? "Com a sua aprovação, o artigo entrou no site."
          : `O artigo tem agora ${atualizado.aprovacoesDeProfessores} de ${atualizado.aprovacoesNecessarias} aprovações.`,
    });
  }

  function aoAlterarStatus(atualizado) {
    setArtigo(atualizado);
    avisar({
      tipo: "sucesso",
      titulo: atualizado.status === "APROVADO" ? "Artigo aprovado" : "Artigo rejeitado",
      mensagem:
        atualizado.status === "APROVADO"
          ? `"${atualizado.titulo}" está publicado no site.`
          : `"${atualizado.titulo}" foi rejeitado, e o autor vê o motivo.`,
    });
  }

  function aoExcluir() {
    avisar({
      tipo: "sucesso",
      titulo: "Artigo excluído",
      mensagem: `"${artigo?.titulo}" foi excluído.`,
    });
    navigate("/articles");
  }

  const etiquetaStatus = artigo ? etiquetaDoArtigo(artigo) : null;
  const mostrarValidacao = Boolean(artigo) && podeValidar(usuario);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
      <Link
        to="/articles"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-texto-suave hover:text-texto"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para os artigos
      </Link>

      <div className="mt-6">
        <EstadoRequisicao
          carregando={carregando}
          mensagemCarregando="Carregando artigo..."
          erro={erro}
          vazio={!artigo}
          mensagemVazio="Artigo não encontrado."
        >
          {artigo && (
            <Cartao className="flex flex-col gap-5 sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <Etiqueta tom="marca">{artigo.categoria.descricao}</Etiqueta>
                {etiquetaStatus && <Etiqueta>{etiquetaStatus}</Etiqueta>}
              </div>

              <h1 className="font-titulo text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
                {artigo.titulo}
              </h1>

              {artigo.autoria ? (
                <div className="flex flex-col gap-1 text-sm text-texto-fraco">
                  <p>
                    Autoria:{" "}
                    <span className="font-semibold text-marca-200">{artigo.autoria}</span>
                  </p>
                  <p>
                    Indicado por{" "}
                    <span className="font-semibold text-marca-200">{artigo.autorNome}</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-texto-fraco">
                  por{" "}
                  <span className="font-semibold text-marca-200">{artigo.autorNome}</span>
                </p>
              )}

              {(artigo.tipoEstudo || artigo.ano) && (
                <p className="text-sm text-texto-fraco">
                  {[artigo.tipoEstudo, artigo.ano && `publicado em ${artigo.ano}`].filter(Boolean).join(" · ")}
                </p>
              )}

              <div className="h-px bg-borda"></div>

              <p className="text-lg leading-relaxed text-texto-suave">{artigo.resumo}</p>
              <a
                href={artigo.fonte}
                target="_blank"
                rel="noopener noreferrer"
                className={estiloDeBotao({ className: "self-start" })}
              >
                Ler o artigo completo
                <ExternalLink size={16} aria-hidden="true" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>

              {artigo.motivoRejeicao && (
                <Alerta tipo="erro" titulo="Motivo da rejeição">
                  <p>{artigo.motivoRejeicao}</p>
                </Alerta>
              )}

              {artigo.podeEditar && (
                <div className="flex flex-wrap gap-3">
                  <EditarArtigo
                    artigo={artigo}
                    categorias={categorias}
                    carregandoOpcoes={carregando}
                    aoEditar={aoEditar}
                  />
                  <ExcluirArtigo
                    artigo={artigo}
                    aoExcluir={aoExcluir}
                  />
                </div>
              )}

              {artigo.podeAprovar && (
                <AprovarArtigo artigo={artigo} aoAprovar={aoAprovar} />
              )}

              {mostrarValidacao && (
                <ValidacaoArtigo artigo={artigo} aoAlterarStatus={aoAlterarStatus} />
              )}
            </Cartao>
          )}
        </EstadoRequisicao>
      </div>
    </div>
  );
}

export default ArticlePages;
