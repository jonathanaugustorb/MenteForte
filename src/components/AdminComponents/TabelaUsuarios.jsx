import Botao from "../ui/Botao";
import Etiqueta from "../ui/Etiqueta";
import { formatarDataCurta } from "../../utils/formatar";
import { rotuloDoPapel } from "../../utils/papeis";

const ESTILO_CABECALHO = "px-4 py-3 text-xs font-semibold tracking-wider text-texto-fraco uppercase whitespace-nowrap";
const ESTILO_CELULA = "px-4 py-3 align-top text-texto-suave";

function TabelaUsuarios({ usuarios, aoEditar, aoAlternarAtivo, aoAnonimizar, idEmOperacao, idDoLogado }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-borda bg-superficie">
      <table className="w-full min-w-3xl border-collapse text-left text-sm">
        <thead className="border-b border-borda bg-superficie-alta/60">
          <tr>
            <th className={ESTILO_CABECALHO}>Usuário</th>
            <th className={ESTILO_CABECALHO}>Perfil</th>
            <th className={ESTILO_CABECALHO}>Situação</th>
            <th className={ESTILO_CABECALHO}>Desde</th>
            <th className={ESTILO_CABECALHO}>Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borda">
          {usuarios.map((usuario) => {
            const anonimizada = Boolean(usuario.anonimizadoEm);
            const ocupada = idEmOperacao === usuario.id;
            const ehAPropriaConta = usuario.id === idDoLogado;
            const naoPodeInativar = anonimizada || (ehAPropriaConta && usuario.ativo);
            const pediuExclusao = Boolean(usuario.anonimizacaoSolicitadaEm) && !anonimizada;

            return (
              <tr key={usuario.id} className="hover:bg-white/[0.02]">
                <td className={`${ESTILO_CELULA} wrap-anywhere`}>
                  <span className="block font-medium text-texto">{usuario.nomeCompleto}</span>
                  <span className="block text-xs text-texto-fraco">{usuario.email}</span>
                </td>
                <td className={ESTILO_CELULA}>
                  <Etiqueta tom="marca">{rotuloDoPapel(usuario.papel)}</Etiqueta>
                </td>
                <td className={ESTILO_CELULA}>
                  <Etiqueta tom={usuario.ativo ? "sucesso" : "neutra"}>{usuario.ativo ? "Ativa" : "Inativa"}</Etiqueta>
                  {anonimizada && (
                    <span className="mt-1.5 block text-xs text-texto-fraco">
                      Anonimizada em {formatarDataCurta(usuario.anonimizadoEm)}
                    </span>
                  )}
                  {pediuExclusao && (
                    <span className="mt-1.5 block text-xs text-aviso">
                      Exclusão pedida em {formatarDataCurta(usuario.anonimizacaoSolicitadaEm)}
                    </span>
                  )}
                </td>
                <td className={`${ESTILO_CELULA} whitespace-nowrap`}>{formatarDataCurta(usuario.criadoEm)}</td>
                <td className={ESTILO_CELULA}>
                  <div className="flex flex-wrap gap-2">
                    <Botao
                      variante="secundario"
                      tamanho="pequeno"
                      onClick={() => aoEditar(usuario)}
                      disabled={anonimizada || ocupada}
                    >
                      Editar
                    </Botao>
                    <Botao
                      variante="secundario"
                      tamanho="pequeno"
                      onClick={() => aoAlternarAtivo(usuario)}
                      disabled={naoPodeInativar || ocupada}
                      title={ehAPropriaConta && usuario.ativo ? "Você não pode inativar a própria conta" : undefined}
                    >
                      {ocupada ? "Salvando..." : usuario.ativo ? "Inativar" : "Reativar"}
                    </Botao>
                    {pediuExclusao && (
                      <Botao variante="perigo" tamanho="pequeno" onClick={() => aoAnonimizar(usuario)} disabled={ocupada}>
                        Anonimizar
                      </Botao>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaUsuarios;
