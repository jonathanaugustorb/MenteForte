import Alerta from "../ui/Alerta";

function AvisoLegal() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Alerta tipo="aviso" titulo="Leia antes de usar">
        <p>
          Estimativas baseadas em fórmulas de referência.{" "}
          <strong>Não substituem a avaliação de um profissional de saúde.</strong> Nenhum número desta página é
          prescrição médica ou nutricional.
        </p>
      </Alerta>
    </div>
  );
}

export default AvisoLegal;
