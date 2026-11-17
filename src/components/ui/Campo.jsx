import { ESTILO_ROTULO } from "./estiloDeCampo";

function Campo({ id, rotulo, dica, erro, obrigatorio = false, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={ESTILO_ROTULO}>
        {rotulo}
        {obrigatorio && (
          <span aria-hidden="true" className="ml-0.5 text-marca-400">
            *
          </span>
        )}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="mt-1.5 text-xs text-perigo">
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-dica`} className="mt-1.5 text-xs text-texto-fraco">
            {dica}
          </p>
        )
      )}
    </div>
  );
}

export default Campo;
