import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import ImagemExercicio from "./ImagemExercicio";
import Botao from "../ui/Botao";
import Etiqueta from "../ui/Etiqueta";
import { etiquetaDoArtigo } from "../ArticlesComponents/artigoCampos";

export const ESTILO_CAIXA_CARROSSEL =
  "w-full sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)] xl:w-[calc((100%_-_4.5rem)/4)] h-[26rem] flex-none snap-start";

const ESTILO_ITEM_MENU =
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-texto-suave hover:bg-white/5 hover:text-texto cursor-pointer";

function CardExercicio({
  exercicio,
  rotuloGrupo,
  rotuloNivel,
  menuAberto,
  aoAlternarMenu,
  aoEditar,
  aoExcluir,
  aoVerTecnica,
  podeEditar,
  estiloCaixa = ESTILO_CAIXA_CARROSSEL,
  alturaImagem,
}) {
  const { nome, gifUrl, equipamento } = exercicio;
  const etiquetaDaSituacao = etiquetaDoArtigo(exercicio);

  return (
    <article
      className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border border-borda bg-superficie shadow-cartao transition-colors hover:border-borda-forte ${estiloCaixa}`}
    >
      <div className="relative shrink-0">
        <ImagemExercicio src={gifUrl} alt={nome} altura={alturaImagem} />
        {etiquetaDaSituacao && (
          <span className="absolute top-3 left-3">
            <Etiqueta className="bg-fundo/85 backdrop-blur">{etiquetaDaSituacao}</Etiqueta>
          </span>
        )}
        {podeEditar && (
          <div className="absolute top-2 right-2 z-20" onMouseDown={(evento) => evento.stopPropagation()}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuAberto}
              aria-label={`Ações de ${nome}`}
              onClick={aoAlternarMenu}
              className="inline-flex size-9 items-center justify-center rounded-lg bg-fundo/80 text-texto-suave backdrop-blur hover:text-texto cursor-pointer"
            >
              <EllipsisVertical size={18} aria-hidden="true" />
            </button>
            {menuAberto && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-40 animate-surgir rounded-xl border border-borda bg-superficie-alta p-1.5 shadow-2xl shadow-black/50"
              >
                <button type="button" role="menuitem" onClick={aoEditar} className={ESTILO_ITEM_MENU}>
                  <Pencil size={16} aria-hidden="true" />
                  Alterar
                </button>
                <button type="button" role="menuitem" onClick={aoExcluir} className={ESTILO_ITEM_MENU}>
                  <Trash2 size={16} aria-hidden="true" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Etiqueta tom="marca">{rotuloGrupo}</Etiqueta>
          <span className="text-xs text-texto-fraco">{rotuloNivel}</span>
        </div>
        <h3 className="line-clamp-2 font-titulo text-lg leading-snug font-bold text-texto wrap-anywhere">{nome}</h3>
        {equipamento && <p className="line-clamp-1 text-sm text-texto-suave">{equipamento}</p>}
        <Botao
          variante="secundario"
          larguraTotal
          className="mt-auto"
          aria-label={`Ver técnica de ${nome}`}
          onClick={aoVerTecnica}
        >
          Ver técnica
        </Botao>
      </div>
    </article>
  );
}

export default CardExercicio;
