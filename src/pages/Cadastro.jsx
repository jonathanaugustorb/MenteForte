import { CircleCheck } from "lucide-react";
import FormCadastro from "../components/ComponentesCadastro/FormCadastro";
import CabecalhoPagina from "../components/ui/CabecalhoPagina";
import Cartao from "../components/ui/Cartao";
import Container from "../components/ui/Container";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";

const DICAS = [
  "Os dados ficam só neste navegador e não são enviados a nenhum servidor.",
  "Use nome e e-mail fictícios: o e-mail não é verificado.",
  "Escolha o perfil de aluno, professor ou administrador para testar cada área.",
  "Prefere só olhar? Use as contas de teste no botão Entrar.",
];

function Cadastro() {
  return (
    <Container className="pb-16">
      <CabecalhoPagina
        titulo="Criar conta"
        subtitulo="Cadastro rápido para testar o MenteForte. Esta é uma versão de demonstração."
        icone={ICONES_DAS_PAGINAS.cadastro}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <FormCadastro />

        <Cartao como="aside" className="space-y-4 lg:sticky lg:top-24">
          <h2 className="font-titulo text-base font-bold text-texto">Como funciona a demonstração</h2>
          <ul className="space-y-3 text-sm text-texto-suave">
            {DICAS.map((dica) => (
              <li key={dica} className="flex gap-2.5">
                <CircleCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-sucesso" />
                {dica}
              </li>
            ))}
          </ul>
        </Cartao>
      </div>
    </Container>
  );
}

export default Cadastro;
