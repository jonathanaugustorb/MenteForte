import Alerta from "./ui/Alerta";
import { LIMITE_CRIACAO_PROFESSOR, limiteDeCriacao } from "../utils/limiteCriacao";

function LimiteDeCriacao({ itens, usuario, tipo }) {
  if (usuario?.papel !== "PROFESSOR") return null;

  const { quantidade, bloqueado } = limiteDeCriacao(itens, usuario);

  return (
    <section aria-label={`Limite de ${tipo}`} aria-live="polite" className="mb-6">
      <Alerta
        tipo={bloqueado ? "aviso" : "info"}
        titulo={`${quantidade} de ${LIMITE_CRIACAO_PROFESSOR} ${tipo} aguardando a aprovação do administrador`}
      >
        <p>
          {bloqueado
            ? "Limite atingido. Aguarde uma aprovação do administrador para criar outro."
            : "Cada aprovação do administrador libera uma vaga para este tipo de conteúdo."}
        </p>
      </Alerta>
    </section>
  );
}

export default LimiteDeCriacao;
