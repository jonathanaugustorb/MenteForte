import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import ListaDeErros from "./ListaDeErros";
import { responderQuiz } from "../../services/quizService";
import { estiloDeBotao } from "../ui/estiloDeBotao";


function estiloDaAlternativa(correcao, alternativaId) {
  if (!correcao) return "border-borda hover:border-marca-500";
  if (alternativaId === correcao.alternativaCorretaId) return "border-sucesso/50 bg-emerald-600/15";
  if (alternativaId === correcao.alternativaEscolhidaId) return "border-marca-500 bg-marca-600/15";
  return "border-borda opacity-70";
}

function ResponderQuiz({ quiz, aoResponder }) {
  const [respostas, setRespostas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);
  const [resultado, setResultado] = useState(null);
  const caixaDoResultado = useRef(null);

  useEffect(() => {
    if (resultado) caixaDoResultado.current?.scrollIntoView({ block: "center" });
  }, [resultado]);

  const todasRespondidas = quiz.questoes.every((questao) => respostas[questao.id]);
  const correcoes = new Map((resultado?.correcao ?? []).map((item) => [item.questaoId, item]));

  function escolher(questaoId, alternativaId) {
    setRespostas((atuais) => ({ ...atuais, [questaoId]: alternativaId }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      const lista = Object.entries(respostas).map(([questaoId, alternativaId]) => ({
        questaoId,
        alternativaId,
      }));
      const devolvido = await responderQuiz(quiz.id, lista);
      setResultado(devolvido);
      aoResponder();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível enviar as respostas.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  function tentarDeNovo() {
    setRespostas({});
    setResultado(null);
    setErro(null);
    setCamposComErro([]);
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6">
      {resultado && (
        <div
          ref={caixaDoResultado}
          role="status"
          className={`rounded-xl border p-4 ${
            resultado.concluido
              ? "border-sucesso/50 bg-emerald-600/10 text-emerald-50"
              : "border-aviso/50 bg-aviso/10 text-amber-50"
          }`}
        >
          <p className="font-semibold">
            Você acertou {resultado.acertos} de {resultado.total} ({resultado.percentual}%).
          </p>
          <p className="mt-1 text-sm">
            {resultado.concluido
              ? "Quiz concluído!"
              : `Para concluir, a nota mínima é ${resultado.notaMinima}%. Releia a leitura sugerida e tente de novo.`}
          </p>
        </div>
      )}

      {quiz.questoes.map((questao, indice) => {
        const correcao = correcoes.get(questao.id);
        return (
          <fieldset key={questao.id} className="flex min-w-0 flex-col gap-2">
            <legend className="mb-2 w-full font-semibold text-white">
              {indice + 1}. {questao.enunciado}
            </legend>

            {questao.alternativas.map((alternativa) => (
              <label
                key={alternativa.id}
                className={`flex items-center gap-3 rounded-lg border p-3 text-sm text-texto ${
                  resultado ? "" : "cursor-pointer"
                } ${estiloDaAlternativa(correcao, alternativa.id)}`}
              >
                <input
                  type="radio"
                  name={`questao-${questao.id}`}
                  value={alternativa.id}
                  checked={respostas[questao.id] === alternativa.id}
                  onChange={() => escolher(questao.id, alternativa.id)}
                  disabled={Boolean(resultado)}
                  className="accent-marca-600"
                />
                <span className="min-w-0 flex-1">{alternativa.texto}</span>
                {correcao && alternativa.id === correcao.alternativaCorretaId && (
                  <Check size={18} className="text-sucesso" aria-label="Alternativa correta" />
                )}
                {correcao &&
                  alternativa.id === correcao.alternativaEscolhidaId &&
                  !correcao.acertou && (
                    <X size={18} className="text-perigo" aria-label="Sua resposta" />
                  )}
              </label>
            ))}

            {correcao?.explicacao && (
              <p className="rounded-lg bg-superficie p-3 text-sm text-texto-suave">
                {correcao.explicacao}
              </p>
            )}
          </fieldset>
        );
      })}

      <ListaDeErros erro={erro} campos={camposComErro} />

      <div className="flex flex-wrap justify-end gap-3">
        {resultado ? (
          <button type="button" onClick={tentarDeNovo} className={estiloDeBotao({ variante: "secundario" })}>
            Tentar de novo
          </button>
        ) : (
          <button
            type="submit"
            disabled={!todasRespondidas || enviando}
            className={estiloDeBotao()}
          >
            {enviando ? "Corrigindo..." : "Enviar respostas"}
          </button>
        )}
      </div>
    </form>
  );
}

export default ResponderQuiz;
