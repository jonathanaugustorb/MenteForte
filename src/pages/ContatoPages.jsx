import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Alerta from "../components/ui/Alerta";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import Cartao from "../components/ui/Cartao";
import Container from "../components/ui/Container";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import { EMAIL_CONTATO } from "../utils/contato";

const ESTILO_TITULO_DA_SECAO = "font-titulo text-2xl font-bold tracking-tight text-texto";
const ESTILO_LINK = "font-semibold text-marca-300 underline underline-offset-4 hover:text-marca-200";

const ASSUNTOS = [
  {
    titulo: "Dúvidas e sugestões",
    texto: "Sobre o uso da plataforma ou ideias para melhorá-la.",
  },
  {
    titulo: "Problemas de acesso",
    texto: "Esqueceu a senha de uma conta criada aqui? Crie outra ou use as contas de teste no botão Entrar.",
  },
  {
    titulo: "Conteúdo com erro",
    texto: "Um artigo, quiz ou exercício que precise de correção. Diga qual é e o que está errado.",
  },
  {
    titulo: "Seus dados pessoais",
    texto: "Nesta demonstração, os dados ficam só no seu navegador. Você pode baixá-los ou apagá-los a qualquer momento.",
  },
];

function ContatoPages() {
  return (
    <Container largura="estreita" className="pb-16">
      <CabecalhoPagina
        titulo="Contato"
        subtitulo="Fale com o MenteForte pelo e-mail abaixo."
        icone={ICONES_DAS_PAGINAS.contato}
      />

      <div className="space-y-12">
        <Cartao className="flex flex-col items-center gap-3 text-center sm:p-10">
          <span className="flex size-12 items-center justify-center rounded-xl bg-marca-600/15 text-marca-400">
            <Mail size={24} aria-hidden="true" />
          </span>
          <a
            href={`mailto:${EMAIL_CONTATO}`}
            className="break-all font-titulo text-2xl font-bold text-texto underline-offset-4 hover:text-marca-200 hover:underline sm:text-3xl"
          >
            {EMAIL_CONTATO}
          </a>
          <Alerta tipo="aviso" className="mt-2 text-left">
            Este é um endereço fictício da versão de demonstração: as mensagens enviadas para ele não chegam a
            ninguém.
          </Alerta>
        </Cartao>

        <section className="space-y-5">
          <h2 className={ESTILO_TITULO_DA_SECAO}>Sobre o que falar com a gente</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ASSUNTOS.map((assunto) => (
              <Cartao key={assunto.titulo}>
                <h3 className="font-titulo text-lg font-bold text-texto">{assunto.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-suave">{assunto.texto}</p>
              </Cartao>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_DA_SECAO}>Resolva pela sua conta</h2>
          <p className="leading-relaxed text-texto-suave">
            Em{" "}
            <Link to="/minha-conta" className={ESTILO_LINK}>
              Minha conta
            </Link>{" "}
            você corrige os seus dados, troca a senha e o e-mail, baixa uma cópia de tudo o que a plataforma
            guarda sobre você e pede a exclusão da conta.
          </p>
        </section>

        <Alerta tipo="info" titulo="Cuidado com a sua senha">
          O MenteForte nunca pede a sua senha por e-mail. Nesta demonstração, use uma senha que você não usa em
          nenhum outro serviço.
        </Alerta>
      </div>
    </Container>
  );
}

export default ContatoPages;
