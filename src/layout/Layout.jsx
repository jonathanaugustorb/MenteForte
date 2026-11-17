import { Suspense, useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import Navegacao from "./Navegacao";
import Rodape from "./Rodape";
import AvisoDeAcao from "./AvisoDeAcao";
import Modal from "../components/ui/Modal";
import Container from "../components/ui/Container";
import Carregando from "../components/ui/Carregando";
import {
  CHAVES_DA_SESSAO,
  EVENTO_SESSAO_EXPIRADA,
  atualizarNomeDaSessao,
  gravarSessao,
  lerSessao,
  limparSessao,
} from "../utils/sessao";

function Layout() {
  const [usuario, setUsuario] = useState(lerSessao);
  const [avisoDeAcao, setAvisoDeAcao] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    function aoExpirar() {
      setUsuario(null);
      setAvisoDeAcao({
        tipo: "erro",
        titulo: "Sessão expirada",
        mensagem: "Entre novamente para continuar usando sua conta.",
      });
      navigate("/", { replace: true });
    }

    function sincronizarSessao(evento) {
      if (evento.key === null || CHAVES_DA_SESSAO.includes(evento.key)) {
        setUsuario(lerSessao());
      }
    }

    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    window.addEventListener("storage", sincronizarSessao);
    return () => {
      window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
      window.removeEventListener("storage", sincronizarSessao);
    };
  }, [navigate]);

  function entrar(resposta, destino) {
    gravarSessao(resposta);
    setUsuario({ id: resposta.id, nomeCompleto: resposta.nomeCompleto, papel: resposta.papel });
    navigate(destino ?? "/inicio");
  }

  function renomear(nomeCompleto) {
    atualizarNomeDaSessao(nomeCompleto);
    setUsuario((atual) => (atual ? { ...atual, nomeCompleto } : atual));
  }

  function sair() {
    limparSessao();
    setUsuario(null);
    navigate("/");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollRestoration />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-marca-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <Navegacao usuario={usuario} aoEntrar={entrar} aoSair={sair} />

      <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense
          fallback={
            <Container className="py-16">
              <Carregando mensagem="Carregando página..." />
            </Container>
          }
        >
          <Outlet context={{ usuario, aoEntrar: entrar, aoRenomear: renomear, avisar: setAvisoDeAcao }} />
        </Suspense>
      </main>

      <Rodape />

      <Modal aberto={avisoDeAcao !== null} aoFechar={() => setAvisoDeAcao(null)} largura="estreita">
        {avisoDeAcao && <AvisoDeAcao {...avisoDeAcao} aoFechar={() => setAvisoDeAcao(null)} />}
      </Modal>
    </div>
  );
}

export default Layout;
