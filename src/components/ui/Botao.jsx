import { estiloDeBotao } from "./estiloDeBotao";

function Botao({ variante, tamanho, larguraTotal, className, type = "button", ...outras }) {
  return (
    <button
      type={type}
      className={estiloDeBotao({ variante, tamanho, larguraTotal, className })}
      {...outras}
    />
  );
}

export default Botao;
