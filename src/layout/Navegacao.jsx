import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogIn, LogOut, Menu, UserRound, X } from "lucide-react";
import Logo from "../components/ui/Logo";
import Modal from "../components/ui/Modal";
import Botao from "../components/ui/Botao";
import Container from "../components/ui/Container";
import { estiloDeBotao } from "../components/ui/estiloDeBotao";
import AvisoLogin from "./AvisoLogin";
import MenuDaConta from "./MenuDaConta";
import { PAPEIS_EDITORES, PAPEIS_VALIDADORES, rotuloDoPapel } from "../utils/papeis";

const LINKS = [
  { para: "/", rotulo: "Home", exato: true },
  { para: "/articles", rotulo: "Artigos", protegida: true },
  { para: "/quiz", rotulo: "Quiz", protegida: true },
  { para: "/library", rotulo: "Biblioteca", protegida: true },
  { para: "/progress", rotulo: "Calculadoras", protegida: true },
  { para: "/meu-acervo", rotulo: "Meu acervo", protegida: true, papeis: PAPEIS_EDITORES },
  { para: "/about", rotulo: "Quem somos" },
  { para: "/admin", rotulo: "Administração", protegida: true, papeis: PAPEIS_VALIDADORES },
];

function estiloDoLinkDesktop({ isActive }) {
  return `whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium transition-colors xl:px-3 ${
    isActive ? "bg-white/[0.07] text-texto" : "text-texto-suave hover:text-texto"
  }`;
}

function estiloDoLinkMovel({ isActive }) {
  return `block rounded-lg px-3 py-2.5 text-base font-medium ${
    isActive ? "bg-white/[0.07] text-texto" : "text-texto-suave hover:bg-white/5 hover:text-texto"
  }`;
}

function Navegacao({ usuario, aoPedirLogin, aoSair }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [destinoProtegido, setDestinoProtegido] = useState(null);

  const links = LINKS.filter(({ papeis }) => !papeis || papeis.includes(usuario?.papel));

  useEffect(() => {
    if (!menuAberto) return;

    function aoTeclar(evento) {
      if (evento.key === "Escape") setMenuAberto(false);
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [menuAberto]);

  function fecharMenu() {
    setMenuAberto(false);
  }

  function abrirLogin() {
    fecharMenu();
    aoPedirLogin(null);
  }

  function irParaLogin() {
    aoPedirLogin(destinoProtegido);
    setDestinoProtegido(null);
  }

  function sair() {
    fecharMenu();
    aoSair();
  }

  function aoClicarLink(evento, protegida, para) {
    if (protegida && !usuario) {
      evento.preventDefault();
      setDestinoProtegido(para);
    }
    fecharMenu();
  }

  function renderizarLinks(estilo) {
    return links.map(({ para, rotulo, exato, protegida }) => (
      <li key={para}>
        <NavLink
          to={para === "/" && usuario ? "/inicio" : para}
          end={exato}
          className={estilo}
          onClick={(evento) => aoClicarLink(evento, protegida, para)}
        >
          {rotulo}
        </NavLink>
      </li>
    ));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-borda/80 bg-fundo/85 backdrop-blur-lg">
      <Container largura="larga" className="flex h-16 items-center gap-4">
        <Link to={usuario ? "/inicio" : "/"} onClick={fecharMenu} className="shrink-0 rounded-lg">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-0.5">{renderizarLinks(estiloDoLinkDesktop)}</ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {usuario ? (
            <MenuDaConta usuario={usuario} aoSair={aoSair} />
          ) : (
            <>
              <Link to="/cadastro" className={estiloDeBotao({ variante: "fantasma", tamanho: "pequeno" })}>
                Cadastre-se
              </Link>
              <Botao tamanho="pequeno" onClick={abrirLogin}>
                <LogIn size={16} aria-hidden="true" />
                Entrar
              </Botao>
            </>
          )}
        </div>

        <button
          type="button"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((atual) => !atual)}
          className="ml-auto inline-flex size-10 items-center justify-center rounded-lg text-texto-suave hover:bg-white/5 hover:text-texto cursor-pointer lg:hidden"
        >
          {menuAberto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </Container>

      {menuAberto && (
        <div id="menu-principal" className="border-t border-borda lg:hidden">
          <Container largura="larga" className="space-y-4 py-4">
            <nav aria-label="Principal">
              <ul className="space-y-1">{renderizarLinks(estiloDoLinkMovel)}</ul>
            </nav>

            <div className="border-t border-borda pt-4">
              {usuario ? (
                <div className="space-y-3">
                  <div className="px-3">
                    <p className="truncate font-semibold text-texto">{usuario.nomeCompleto}</p>
                    <p className="text-sm text-texto-fraco">{rotuloDoPapel(usuario.papel)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/minha-conta"
                      onClick={fecharMenu}
                      className={estiloDeBotao({ variante: "secundario" })}
                    >
                      <UserRound size={16} aria-hidden="true" />
                      Meus dados
                    </Link>
                    <Botao variante="contorno" onClick={sair}>
                      <LogOut size={16} aria-hidden="true" />
                      Sair
                    </Botao>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cadastro"
                    onClick={fecharMenu}
                    className={estiloDeBotao({ variante: "secundario" })}
                  >
                    Cadastre-se
                  </Link>
                  <Botao onClick={abrirLogin}>
                    <LogIn size={16} aria-hidden="true" />
                    Entrar
                  </Botao>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}

      <Modal aberto={destinoProtegido !== null} aoFechar={() => setDestinoProtegido(null)} largura="estreita">
        <AvisoLogin aoFazerLogin={irParaLogin} />
      </Modal>
    </header>
  );
}

export default Navegacao;
