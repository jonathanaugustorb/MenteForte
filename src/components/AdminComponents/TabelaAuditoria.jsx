import { fraseDoEvento } from "./eventoAuditoria";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-marca-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-texto-suave align-top";

function formatarMomento(valor) {
  if (!valor) return "--";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "--";

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TabelaAuditoria({ registros }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-2xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-borda">
            <th className={ESTILO_CABECALHO}>Quando</th>
            <th className={ESTILO_CABECALHO}>Evento</th>
            <th className={ESTILO_CABECALHO}>Usuário</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id} className="border-b border-borda">
              <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                {formatarMomento(registro.ocorridoEm)}
              </td>
              <td className={ESTILO_CELULA}>
                <span className="rounded-md bg-marca-600 px-2 py-1 text-xs font-medium text-white">
                  {fraseDoEvento(registro)}
                </span>
              </td>
              <td className={`${ESTILO_CELULA} wrap-anywhere`}>
                {registro.usuarioNome ? (
                  <>
                    <span className="block text-white">{registro.usuarioNome}</span>
                    <span className="block text-xs text-texto-fraco">
                      {registro.usuarioEmail}
                    </span>
                  </>
                ) : (
                  <span className="text-texto-fraco">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAuditoria;
