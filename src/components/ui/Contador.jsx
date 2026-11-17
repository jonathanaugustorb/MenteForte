function Contador({ id, atual, maximo, minimo, className = "" }) {
  const acima = atual > maximo;
  const abaixo = minimo !== undefined && atual > 0 && atual < minimo;

  return (
    <span
      id={id}
      className={`mt-1 block text-right text-xs ${acima || abaixo ? "text-perigo" : "text-texto-fraco"} ${className}`}
    >
      {minimo !== undefined && `Mínimo de ${minimo} · `}
      {atual}/{maximo}
    </span>
  );
}

export default Contador;
