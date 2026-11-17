import { mascaraDecimal, mascaraInteira } from "../../utils/formatar";
import { ESTILO_ENTRADA } from "../ui/estiloDeCampo";

function CampoNumero({
  id,
  rotulo,
  valor,
  aoAlterar,
  decimal,
  digitos = 6,
  casas = 1,
  placeholder,
  classeRotulo,
}) {
  function aoDigitar(evento) {
    const texto = evento.target.value;

    aoAlterar(
      decimal ? mascaraDecimal(texto, digitos, casas) : mascaraInteira(texto, digitos),
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-sm font-medium text-texto ${classeRotulo ?? ""}`}
      >
        {rotulo}
      </label>
      <input
        id={id}
        type="text"
        inputMode={decimal ? "decimal" : "numeric"}
        maxLength={decimal ? digitos + casas + 1 : digitos}
        autoComplete="off"
        value={valor}
        placeholder={placeholder}
        onChange={aoDigitar}
        className={`${ESTILO_ENTRADA} min-w-0 text-base`}
      />
    </div>
  );
}

export default CampoNumero;
