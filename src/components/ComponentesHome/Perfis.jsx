import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Botao from "../ui/Botao";
import Cartao from "../ui/Cartao";
import Container from "../ui/Container";
import TituloDeSecao from "../ui/TituloDeSecao";
import { PERFIS } from "./dadosHome";
import { login } from "../../services/authService";
import { CONTAS_DE_TESTE, SENHA_DE_TESTE } from "../../demo/contasDeTeste";

function Perfis() {
  const { aoEntrar, avisar } = useOutletContext();
  const [entrandoComo, setEntrandoComo] = useState(null);

  async function entrarComo(papel) {
    const conta = CONTAS_DE_TESTE.find((candidata) => candidata.papel === papel);
    setEntrandoComo(papel);
    try {
      aoEntrar(await login(conta.email, SENHA_DE_TESTE));
    } catch (falha) {
      avisar({ tipo: "erro", titulo: "Não foi possível entrar", mensagem: falha.mensagem || "Tente novamente." });
      setEntrandoComo(null);
    }
  }

  return (
    <section aria-labelledby="titulo-perfis" className="border-y border-borda bg-superficie/30 py-20 sm:py-24">
      <Container largura="larga">
        <TituloDeSecao
          id="titulo-perfis"
          sobretitulo="Três perfis"
          titulo="Teste cada perfil com um clique"
          descricao="Cada perfil vê uma parte diferente da plataforma. Entre com uma conta de teste pronta, sem precisar se cadastrar."
          centralizado
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PERFIS.map(({ papel, icone: Icone, titulo, texto }) => (
            <Cartao key={papel} className="flex flex-col gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-marca-600/15 text-marca-400 ring-1 ring-inset ring-marca-500/25">
                <Icone size={24} aria-hidden="true" />
              </span>
              <h3 className="font-titulo text-xl font-bold text-texto">{titulo}</h3>
              <p className="flex-1 text-sm leading-relaxed text-texto-suave">{texto}</p>
              <Botao variante="secundario" onClick={() => entrarComo(papel)} disabled={entrandoComo !== null}>
                {entrandoComo === papel ? "Entrando..." : `Entrar como ${titulo.toLowerCase()}`}
                <ArrowRight size={16} aria-hidden="true" />
              </Botao>
            </Cartao>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Perfis;
