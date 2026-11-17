import Alerta from "./ui/Alerta";

function AvisoCref({ situacao, motivo }) {
  if (situacao === "PENDENTE") {
    return (
      <Alerta tipo="aviso" titulo="Verificação do CREF pendente" className="mt-4">
        <p>
          Até um administrador conferir o seu CREF, sua conta tem as permissões de aluno. Depois
          da aprovação, as permissões de professor valem a partir do próximo login.
        </p>
      </Alerta>
    );
  }

  if (situacao === "REJEITADO") {
    return (
      <Alerta tipo="erro" titulo="Verificação do CREF rejeitada" className="mt-4">
        {motivo && <p>Motivo: {motivo}</p>}
        <p>
          Sua conta continua com as permissões de aluno. Para corrigir o CREF ou a formação, use o
          botão "Atualizar CREF" em Minha conta.
        </p>
      </Alerta>
    );
  }

  return null;
}

export default AvisoCref;
