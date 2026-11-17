import { http } from "msw";
import { rota } from "../apoio/rota";
import { exigirPapel, usuarioAutenticado } from "../apoio/acesso";
import { erroDeRegra } from "../apoio/erros";
import { dataHaDias, formatarData } from "../apoio/tempo";
import { criarValidacao } from "../apoio/validacao";

const DIAS_MINIMO = 1;
const DIAS_MAXIMO = 90;

function exigirAdministrador(request, banco) {
  exigirPapel(usuarioAutenticado(request, banco), "ADMINISTRADOR");
}

export const manipuladoresDeEstatisticas = [
  http.get(
    "/api/estatisticas/contas-por-papel",
    rota(({ request, banco }) => {
      exigirAdministrador(request, banco);
      return ["ALUNO", "PROFESSOR", "ADMINISTRADOR"].map((papel) => ({
        papel,
        total: banco.usuarios.filter((usuario) => usuario.papel === papel && !usuario.anonimizadoEm).length,
      }));
    }),
  ),

  http.get(
    "/api/estatisticas/atividade-por-dia",
    rota(({ request, consulta, banco }) => {
      exigirAdministrador(request, banco);
      const dias = Number.parseInt(consulta.get("dias") ?? "7", 10);
      criarValidacao().exigir(Number.isInteger(dias), "dias", "Informe o número de dias").concluir();
      if (dias < DIAS_MINIMO || dias > DIAS_MAXIMO) {
        throw erroDeRegra(`O número de dias deve estar entre ${DIAS_MINIMO} e ${DIAS_MAXIMO}`);
      }

      const primeiroDia = dataHaDias(dias - 1);
      const totais = new Map();
      banco.auditoria
        .filter((registro) => registro.acao !== "LIDO" && registro.ocorridoEm.slice(0, 10) >= primeiroDia)
        .forEach((registro) => {
          const dia = registro.ocorridoEm.slice(0, 10);
          totais.set(dia, (totais.get(dia) ?? 0) + 1);
        });

      return Array.from({ length: dias }, (_, deslocamento) => {
        const data = new Date(`${primeiroDia}T12:00:00`);
        data.setDate(data.getDate() + deslocamento);
        const dia = formatarData(data);
        return { dia, total: totais.get(dia) ?? 0 };
      });
    }),
  ),
];
