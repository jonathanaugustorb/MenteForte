import { useState } from "react";
import Alerta from "./ui/Alerta";
import Botao from "./ui/Botao";

const SECOES = [
  {
    titulo: "Como funciona",
    itens: [
      "O pedido fica registrado e um administrador o cumpre.",
      "Até lá, sua conta continua funcionando normalmente.",
      "Você pode desistir a qualquer momento antes disso.",
    ],
  },
  {
    titulo: "O que será apagado",
    itens: ["Nome, e-mail e senha", "Seus resultados nos quizzes"],
  },
  {
    titulo: "O que permanece",
    itens: [
      "O registro de que você aceitou os Termos e a Política, sem os seus dados",
      "Os conteúdos que você publicou, sem identificar o autor",
    ],
  },
];

function ConfirmarExclusaoConta({ aoConfirmar, aoCancelar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function confirmar() {
    setEnviando(true);
    setErro(null);
    try {
      await aoConfirmar();
    } catch (falha) {
      setErro(falha.mensagem || "Não foi possível registrar o pedido. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-titulo text-xl font-bold text-texto">Excluir minha conta</h2>
        <p className="text-sm text-texto-fraco">
          Direito de eliminação previsto no art. 18 da Lei Geral de Proteção de Dados.
        </p>
      </div>

      <Alerta tipo="aviso">
        Depois que um administrador cumprir o pedido, os seus dados pessoais são apagados e{" "}
        <strong>não há como recuperá-los</strong>.
      </Alerta>

      {SECOES.map((secao) => (
        <div key={secao.titulo}>
          <h3 className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">{secao.titulo}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-texto-suave marker:text-marca-400">
            {secao.itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <div className="flex flex-wrap justify-end gap-3">
        <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
          Voltar
        </Botao>
        <Botao variante="perigo" onClick={confirmar} disabled={enviando}>
          {enviando ? "Registrando..." : "Pedir a exclusão"}
        </Botao>
      </div>
    </div>
  );
}

export default ConfirmarExclusaoConta;
