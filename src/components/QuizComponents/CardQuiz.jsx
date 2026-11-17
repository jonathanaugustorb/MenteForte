import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import Etiqueta from "../ui/Etiqueta";
import { etiquetaDoArtigo } from "../ArticlesComponents/artigoCampos";

function CardQuiz({ quiz }) {
  const etiquetaStatus = etiquetaDoArtigo(quiz);
  const nota = quiz.melhorTentativa;

  return (
    <Link
      to={`/quiz/${quiz.id}`}
      className="group flex h-full flex-col rounded-2xl border border-borda bg-superficie p-6 shadow-cartao transition-colors hover:border-marca-500/60 focus-visible:border-marca-500"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Etiqueta tom="marca">{quiz.categoria.descricao}</Etiqueta>
        {etiquetaStatus && <Etiqueta>{etiquetaStatus}</Etiqueta>}
      </div>

      <h3 className="mt-4 font-titulo text-lg font-bold text-texto group-hover:text-marca-100">{quiz.titulo}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-texto-suave">{quiz.descricao}</p>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-borda pt-4 text-xs text-texto-fraco">
          <span>
            {quiz.nivel.descricao} · {quiz.totalQuestoes} perguntas
          </span>
          {nota &&
            (nota.concluido ? (
              <Etiqueta tom="sucesso">
                <CircleCheck size={12} aria-hidden="true" />
                Concluído · {nota.percentual}%
              </Etiqueta>
            ) : (
              <span className="text-texto-suave">Melhor nota: {nota.percentual}%</span>
            ))}
        </div>
      </div>
    </Link>
  );
}

export default CardQuiz;
