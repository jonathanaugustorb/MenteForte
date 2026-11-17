import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Download } from "lucide-react";
import Botao from "./ui/Botao";
import { buscarMinhaConta } from "../services/usuarioService";
import { listarQuizzes } from "../services/quizService";
import { listarArtigos } from "../services/artigoService";
import { listarExercicios } from "../services/exercicioService";
import { baixarArquivo } from "../utils/csv";
import { rotuloDoPapel } from "../utils/papeis";
import { STATUS_ARTIGO } from "./ArticlesComponents/artigoCampos";

function situacao(codigo) {
  return STATUS_ARTIGO[codigo]?.descricao ?? codigo;
}

function dadosDaConta(conta) {
  return {
    nomeCompleto: conta.nomeCompleto,
    email: conta.email,
    perfil: rotuloDoPapel(conta.papel),
    cadastradoEm: conta.criadoEm,
    situacao: conta.ativo ? "Ativa" : "Inativa",
    exclusaoSolicitadaEm: conta.anonimizacaoSolicitadaEm,
  };
}

function resultadosDeQuiz(quizzes) {
  return quizzes
    .filter((quiz) => quiz.melhorTentativa)
    .map((quiz) => ({
      quiz: quiz.titulo,
      categoria: quiz.categoria?.descricao,
      nivel: quiz.nivel?.descricao,
      acertos: quiz.melhorTentativa.acertos,
      total: quiz.melhorTentativa.total,
      percentual: quiz.melhorTentativa.percentual,
      concluido: quiz.melhorTentativa.concluido,
    }));
}

function enviados(itens, campos) {
  return itens
    .filter((item) => item.podeEditar)
    .map((item) => ({ ...campos(item), situacao: situacao(item.status), enviadoEm: item.criadoEm }));
}

async function reunirDados() {
  const conta = await buscarMinhaConta();
  const professor = conta.papel === "PROFESSOR";
  const [quizzes, artigos, exercicios] = await Promise.all([
    listarQuizzes(),
    professor ? listarArtigos() : [],
    professor ? listarExercicios() : [],
  ]);
  return {
    documento: "Cópia dos seus dados no MenteForte",
    baseLegal: "Lei nº 13.709/2018 (LGPD), art. 18, inciso V: portabilidade dos dados",
    geradoEm: new Date().toISOString(),
    conta: dadosDaConta(conta),
    resultadosDeQuiz: resultadosDeQuiz(quizzes),
    ...(professor && {
      artigosEnviados: enviados(artigos, ({ titulo, resumo, fonte, autoria, tipoEstudo, ano, categoria }) => ({
        titulo,
        categoria: categoria?.descricao,
        resumo,
        fonte,
        autoria,
        tipoEstudo,
        ano,
      })),
      quizzesEnviados: enviados(quizzes, ({ titulo, descricao, categoria, nivel }) => ({
        titulo,
        descricao,
        categoria: categoria?.descricao,
        nivel: nivel?.descricao,
      })),
      exerciciosEnviados: enviados(exercicios, ({ nome, grupoMuscular, nivel }) => ({
        nome,
        grupoMuscular,
        nivel,
      })),
    }),
  };
}

function BaixarMeusDados() {
  const { avisar } = useOutletContext();
  const [gerando, setGerando] = useState(false);

  async function baixar() {
    setGerando(true);
    try {
      const copia = await reunirDados();
      const nomeArquivo = `menteforte-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
      baixarArquivo(
        nomeArquivo,
        new Blob([JSON.stringify(copia, null, 2)], { type: "application/json;charset=utf-8" }),
      );
      avisar({
        tipo: "sucesso",
        titulo: "Seus dados foram baixados",
        mensagem: `O arquivo ${nomeArquivo} está na pasta de downloads do navegador, em JSON, um formato aberto.`,
      });
    } catch (falha) {
      avisar({
        tipo: "erro",
        titulo: "Arquivo não gerado",
        mensagem: falha.mensagem || "Não foi possível reunir os seus dados. Tente de novo em instantes.",
      });
    } finally {
      setGerando(false);
    }
  }

  return (
    <Botao variante="secundario" onClick={baixar} disabled={gerando}>
      <Download size={16} aria-hidden="true" />
      {gerando ? "Gerando arquivo..." : "Baixar meus dados"}
    </Botao>
  );
}

export default BaixarMeusDados;
