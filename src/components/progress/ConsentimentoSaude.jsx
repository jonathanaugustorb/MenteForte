import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function ConsentimentoSaude({ consentiu, aoAlterar }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flex gap-4 rounded-2xl border border-borda bg-superficie p-5 shadow-cartao">
        <ShieldCheck className="shrink-0 text-marca-400" size={22} aria-hidden="true" />

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wider text-marca-300 uppercase">
            Dados de saúde
          </span>
          <p className="text-texto-suave wrap-break-word">
            As calculadoras abaixo pedem peso, altura, idade, sexo, nível de
            atividade, tempo de treino e consumo de água. São dados pessoais
            sensíveis, usados só para calcular o resultado nesta tela:{" "}
            <span className="font-semibold text-white">
              não são gravados nem ficam associados à sua conta.
            </span>
          </p>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="consentimento-saude"
              checked={consentiu}
              onChange={(evento) => aoAlterar(evento.target.checked)}
              className="h-5 w-5 accent-marca-600"
            />
            <label htmlFor="consentimento-saude" className="text-white">
              Concordo em informar esses dados para o cálculo, conforme a{" "}
              <Link
                to="/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-marca-200 underline hover:text-white"
              >
                Política de Privacidade
              </Link>
              .
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentimentoSaude;