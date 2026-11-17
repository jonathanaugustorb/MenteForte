import { BookOpen, Dumbbell, ShieldCheck } from "lucide-react";

const PERFIS = [
  {
    codigo: "ALUNO",
    titulo: "Aluno",
    descricao: "Lê os artigos, consulta a biblioteca, responde aos quizzes e usa as calculadoras.",
    Icone: BookOpen,
  },
  {
    codigo: "PROFESSOR",
    titulo: "Professor",
    descricao: "Sou profissional de Educação Física: também crio e reviso artigos, quizzes e exercícios.",
    Icone: Dumbbell,
  },
  {
    codigo: "ADMINISTRADOR",
    titulo: "Administrador",
    descricao: "Decide o que é publicado e cuida das contas, dos pedidos de exclusão e da auditoria.",
    Icone: ShieldCheck,
  },
];

function EscolhaDePerfil({ valor, aoAlterar }) {
  return (
    <fieldset>
      <legend className="sr-only">Perfil da conta</legend>
      <div className="grid gap-3 md:grid-cols-3">
        {PERFIS.map(({ codigo, titulo, descricao, Icone }) => (
          <label
            key={codigo}
            className="flex cursor-pointer flex-col gap-2 rounded-xl border border-borda bg-fundo/40 p-4 transition-colors hover:border-borda-forte has-checked:border-marca-500 has-checked:bg-marca-600/10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-marca-400"
          >
            <input
              type="radio"
              name="papel"
              value={codigo}
              checked={valor === codigo}
              onChange={aoAlterar}
              className="sr-only"
            />
            <span className="flex items-center gap-2 font-semibold text-texto">
              <Icone size={18} aria-hidden="true" className="text-marca-400" />
              {titulo}
            </span>
            <span className="text-sm leading-relaxed text-texto-suave">{descricao}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default EscolhaDePerfil;
