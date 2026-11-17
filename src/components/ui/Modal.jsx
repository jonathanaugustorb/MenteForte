import { useEffect, useId, useRef } from "react";
import { GripHorizontal, X } from "lucide-react";

const LARGURAS = {
  estreita: "max-w-md",
  padrao: "max-w-lg",
  larga: "max-w-2xl",
};

const SELETOR_FOCAVEL =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function limitar(valor, maximo) {
  return Math.min(Math.max(0, valor), Math.max(0, maximo));
}

function posicionar(elemento, posicaoAtual, destino) {
  const caixa = elemento.getBoundingClientRect();
  const origemX = caixa.left - posicaoAtual.x;
  const origemY = caixa.top - posicaoAtual.y;
  const x = limitar(origemX + destino.x, document.documentElement.clientWidth - caixa.width) - origemX;
  const y = limitar(origemY + destino.y, document.documentElement.clientHeight - caixa.height) - origemY;

  elemento.style.setProperty("--modal-x", `${x}px`);
  elemento.style.setProperty("--modal-y", `${y}px`);
  return { x, y };
}

function Modal({ aberto, aoFechar, largura = "padrao", rotulo, children }) {
  const dialogo = useRef(null);
  const posicao = useRef({ x: 0, y: 0 });
  const arraste = useRef(null);
  const tituloId = useId();

  useEffect(() => {
    if (!aberto) return;
    const elemento = dialogo.current;
    const titulo = elemento.querySelector("h1, h2, h3");
    if (titulo) {
      if (!titulo.id) titulo.id = tituloId;
      elemento.setAttribute("aria-labelledby", titulo.id);
    } else {
      elemento.removeAttribute("aria-labelledby");
    }
  }, [aberto, children, tituloId]);

  useEffect(() => {
    if (!aberto) return;
    const elemento = dialogo.current;
    const focoAnterior = document.activeElement;
    posicao.current = { x: 0, y: 0 };
    elemento.showModal();

    function manterNaTela() {
      posicao.current = posicionar(elemento, posicao.current, posicao.current);
    }

    const observador = new ResizeObserver(manterNaTela);
    observador.observe(elemento);
    window.addEventListener("resize", manterNaTela);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", manterNaTela);
      arraste.current = null;
      elemento.close();
      queueMicrotask(() => {
        if (focoAnterior?.isConnected && !document.querySelector("dialog[open]")) {
          focoAnterior.focus();
        }
      });
    };
  }, [aberto]);

  function iniciarArraste(evento) {
    if (!evento.isPrimary || evento.button !== 0) return;
    evento.preventDefault();
    arraste.current = {
      ponteiro: evento.pointerId,
      origemX: evento.clientX - posicao.current.x,
      origemY: evento.clientY - posicao.current.y,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function arrastar(evento) {
    const inicio = arraste.current;
    if (inicio?.ponteiro !== evento.pointerId) return;
    posicao.current = posicionar(dialogo.current, posicao.current, {
      x: evento.clientX - inicio.origemX,
      y: evento.clientY - inicio.origemY,
    });
  }

  function encerrarArraste(evento) {
    if (arraste.current?.ponteiro === evento.pointerId) arraste.current = null;
  }

  function conterFoco(evento) {
    if (evento.key !== "Tab") return;
    const elementos = [...dialogo.current.querySelectorAll(SELETOR_FOCAVEL)].filter(
      (elemento) => elemento.tabIndex >= 0 && elemento.getClientRects().length > 0,
    );
    const primeiro = elementos[0];
    const ultimo = elementos.at(-1);
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo?.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro?.focus();
    }
  }

  if (!aberto) return null;

  return (
    <dialog
      ref={dialogo}
      aria-label={rotulo}
      onKeyDown={conterFoco}
      onCancel={(evento) => {
        evento.preventDefault();
        aoFechar();
      }}
      className={`fixed top-1/2 left-1/2 m-0 max-h-[min(88dvh,56rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-borda bg-superficie text-texto shadow-2xl shadow-black/60 backdrop:bg-black/70 backdrop:backdrop-blur-sm open:flex open:animate-surgir ${LARGURAS[largura]}`}
      style={{ translate: "calc(-50% + var(--modal-x, 0px)) calc(-50% + var(--modal-y, 0px))" }}
    >
      <div
        aria-hidden="true"
        title="Arraste para mover a janela"
        onPointerDown={iniciarArraste}
        onPointerMove={arrastar}
        onLostPointerCapture={encerrarArraste}
        className="mx-auto flex h-11 w-24 shrink-0 touch-none select-none items-center justify-center text-texto-fraco cursor-grab hover:text-texto active:cursor-grabbing"
      >
        <GripHorizontal size={18} />
      </div>
      <div className="min-h-0 overflow-y-auto px-6 pb-6">{children}</div>
      <button
        type="button"
        aria-label="Fechar"
        onClick={aoFechar}
        className="absolute top-1.5 right-2 inline-flex size-8 items-center justify-center rounded-lg text-texto-fraco hover:bg-white/5 hover:text-texto cursor-pointer"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </dialog>
  );
}

export default Modal;
