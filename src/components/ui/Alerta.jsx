import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

const TIPOS = {
  erro: {
    Icone: CircleAlert,
    papel: "alert",
    caixa: "border-perigo/30 bg-perigo/10 text-red-100",
    icone: "text-perigo",
  },
  sucesso: {
    Icone: CircleCheck,
    papel: "status",
    caixa: "border-sucesso/30 bg-sucesso/10 text-emerald-50",
    icone: "text-sucesso",
  },
  aviso: {
    Icone: TriangleAlert,
    papel: "status",
    caixa: "border-aviso/30 bg-aviso/10 text-amber-50",
    icone: "text-aviso",
  },
  info: {
    Icone: Info,
    papel: "status",
    caixa: "border-borda-forte bg-superficie-alta text-texto-suave",
    icone: "text-texto-suave",
  },
};

function Alerta({ tipo = "info", titulo, className = "", children }) {
  const { Icone, papel, caixa, icone } = TIPOS[tipo];

  return (
    <div role={papel} className={`flex gap-3 rounded-xl border p-4 text-sm ${caixa} ${className}`}>
      <Icone size={18} aria-hidden="true" className={`mt-0.5 shrink-0 ${icone}`} />
      <div className="min-w-0 space-y-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children}
      </div>
    </div>
  );
}

export default Alerta;
