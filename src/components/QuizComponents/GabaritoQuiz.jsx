import { Check } from "lucide-react";

function GabaritoQuiz({ quiz }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-texto-fraco">
        Você vê o gabarito porque é o autor, o administrador ou um professor revisando um
        quiz pendente.
      </p>

      {quiz.questoes.map((questao, indice) => (
        <div key={questao.id} className="flex flex-col gap-2">
          <p className="font-semibold text-white">
            {indice + 1}. {questao.enunciado}
          </p>
          <ul className="flex flex-col gap-2">
            {questao.alternativas.map((alternativa) => (
              <li
                key={alternativa.id}
                className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                  alternativa.correta
                    ? "border-sucesso/50 bg-emerald-600/15 text-emerald-50"
                    : "border-borda text-texto-suave"
                }`}
              >
                <span className="min-w-0 flex-1">{alternativa.texto}</span>
                {alternativa.correta && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-sucesso">
                    <Check size={16} aria-hidden="true" />
                    Correta
                  </span>
                )}
              </li>
            ))}
          </ul>
          {questao.explicacao && (
            <p className="rounded-lg bg-superficie p-3 text-sm text-texto-suave">
              {questao.explicacao}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default GabaritoQuiz;
