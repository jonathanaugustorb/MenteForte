import { http, HttpResponse } from "msw";
import { rota } from "../apoio/rota";
import { exigirPapel, usuarioAutenticado } from "../apoio/acesso";
import { ACOES_DE_AUDITORIA, RECURSOS_DE_AUDITORIA } from "../apoio/auditoria";
import { mascararEmail } from "../apoio/mascaras";
import { paginar } from "../apoio/paginacao";

const TAMANHO_PADRAO_DA_PAGINA = 50;
const INICIOS_DE_FORMULA = "=+-@\t\r";
const CABECALHO_CSV = "Quando;Ação;Usuário;E-mail;Recurso;Identificador do recurso;Justificativa";

function descricaoDe(lista, codigo) {
  return lista.find((item) => item.codigo === codigo)?.descricao ?? codigo;
}

function paraDTO(banco, registro) {
  const usuario = banco.usuarios.find((candidato) => candidato.id === registro.usuarioId);
  return {
    id: registro.id,
    ocorridoEm: registro.ocorridoEm,
    acao: registro.acao,
    descricaoAcao: descricaoDe(ACOES_DE_AUDITORIA, registro.acao),
    recursoTipo: registro.recursoTipo,
    descricaoRecursoTipo: descricaoDe(RECURSOS_DE_AUDITORIA, registro.recursoTipo),
    recursoId: registro.recursoId,
    usuarioId: registro.usuarioId,
    usuarioNome: usuario?.nomeCompleto ?? null,
    usuarioEmail: usuario ? mascararEmail(usuario.email) : null,
    justificativa: registro.justificativa,
  };
}

function filtrar(banco, consulta) {
  const de = consulta.get("de");
  const ate = consulta.get("ate");
  const acao = consulta.get("acao");

  return banco.auditoria
    .filter((registro) => !de || registro.ocorridoEm.slice(0, 10) >= de)
    .filter((registro) => !ate || registro.ocorridoEm.slice(0, 10) <= ate)
    .filter((registro) => !acao || registro.acao === acao)
    .sort((a, b) => b.ocorridoEm.localeCompare(a.ocorridoEm));
}

function escaparCsv(valor) {
  if (valor == null) return "";
  let texto = String(valor);
  if (INICIOS_DE_FORMULA.includes(texto[0])) texto = `'${texto}`;
  return /[;"\n\r]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
}

function formatarMomentoCsv(momento) {
  const [data, hora] = momento.split("T");
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora}`;
}

function exigirAdministrador(request, banco) {
  exigirPapel(usuarioAutenticado(request, banco), "ADMINISTRADOR");
}

export const manipuladoresDeAuditoria = [
  http.get(
    "/api/auditoria/acoes",
    rota(({ request, banco }) => {
      exigirAdministrador(request, banco);
      return ACOES_DE_AUDITORIA;
    }),
  ),

  http.get(
    "/api/auditoria/recursos",
    rota(({ request, banco }) => {
      exigirAdministrador(request, banco);
      return RECURSOS_DE_AUDITORIA;
    }),
  ),

  http.get(
    "/api/auditoria/csv",
    rota(({ request, consulta, banco }) => {
      exigirAdministrador(request, banco);
      const linhas = filtrar(banco, consulta).map((registro) => {
        const dto = paraDTO(banco, registro);
        return [
          formatarMomentoCsv(dto.ocorridoEm),
          dto.descricaoAcao,
          dto.usuarioNome,
          dto.usuarioEmail,
          dto.descricaoRecursoTipo,
          dto.recursoId,
          dto.justificativa,
        ]
          .map(escaparCsv)
          .join(";");
      });

      return new HttpResponse([CABECALHO_CSV, ...linhas].join("\n"), {
        headers: { "Content-Type": "text/csv; charset=utf-8" },
      });
    }),
  ),

  http.get(
    "/api/auditoria",
    rota(({ request, consulta, banco }) => {
      exigirAdministrador(request, banco);
      const pagina = paginar(filtrar(banco, consulta), consulta, TAMANHO_PADRAO_DA_PAGINA);
      return { ...pagina, conteudo: pagina.conteudo.map((registro) => paraDTO(banco, registro)) };
    }),
  ),
];
