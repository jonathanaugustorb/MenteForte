import { lazy } from "react";
import { createBrowserRouter, Navigate, redirect, RouterProvider } from "react-router-dom";
import HomePages from "./pages/HomePages.jsx";
import Layout from "./layout/Layout.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";
import RotaPorPapel from "./components/RotaPorPapel.jsx";
import { PAPEIS_EDITORES, PAPEIS_VALIDADORES } from "./utils/papeis.js";
import { lerSessao } from "./utils/sessao.js";

const AboutPages = lazy(() => import("./pages/AboutPages.jsx"));
const ContatoPages = lazy(() => import("./pages/ContatoPages.jsx"));
const LibraryPages = lazy(() => import("./pages/LibraryPages.jsx"));
const ProgressPages = lazy(() => import("./pages/ProgressPages.jsx"));
const Cadastro = lazy(() => import("./pages/Cadastro.jsx"));
const ArticlesPages = lazy(() => import("./pages/ArticlesPages.jsx"));
const ArticlePages = lazy(() => import("./pages/ArticlePages.jsx"));
const TermosPages = lazy(() => import("./pages/TermosPages.jsx"));
const PoliticaPages = lazy(() => import("./pages/PoliticaPages.jsx"));
const AuditoriaPages = lazy(() => import("./pages/AuditoriaPages.jsx"));
const UsuariosPages = lazy(() => import("./pages/UsuariosPages.jsx"));
const ItensPendentesPages = lazy(() => import("./pages/ItensPendentesPages.jsx"));
const MinhaContaPages = lazy(() => import("./pages/MinhaContaPages.jsx"));
const QuizzesPages = lazy(() => import("./pages/QuizzesPages.jsx"));
const QuizPages = lazy(() => import("./pages/QuizPages.jsx"));
const QuizFormPages = lazy(() => import("./pages/QuizFormPages.jsx"));
const InicioPages = lazy(() => import("./pages/InicioPages.jsx"));
const MeuAcervoPages = lazy(() => import("./pages/MeuAcervoPages.jsx"));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePages />, loader: () => (lerSessao() ? redirect("/inicio") : null) },
      { path: "/cadastro", element: <Cadastro /> },
      { path: "/termos-de-uso", element: <TermosPages /> },
      { path: "/politica-de-privacidade", element: <PoliticaPages /> },
      { path: "/about", element: <AboutPages /> },
      { path: "/contato", element: <ContatoPages /> },
      {
        element: <RotaProtegida />,
        children: [
          { path: "/inicio", element: <InicioPages /> },
          { path: "/articles", element: <ArticlesPages /> },
          { path: "/articles/:id", element: <ArticlePages /> },
          { path: "/quiz", element: <QuizzesPages /> },
          { path: "/quiz/:id", element: <QuizPages /> },
          { path: "/library", element: <LibraryPages /> },
          { path: "/progress", element: <ProgressPages /> },
          { path: "/minha-conta", element: <MinhaContaPages /> },
        ],
      },
      {
        element: <RotaPorPapel papeis={PAPEIS_EDITORES} />,
        children: [
          { path: "/quiz/novo", element: <QuizFormPages /> },
          { path: "/quiz/:id/editar", element: <QuizFormPages /> },
          { path: "/meu-acervo", element: <MeuAcervoPages /> },
        ],
      },
      {
        element: <RotaPorPapel papeis={PAPEIS_VALIDADORES} />,
        children: [
          { path: "/admin", element: <Navigate to="/admin/usuarios" replace /> },
          { path: "/admin/usuarios", element: <UsuariosPages /> },
          { path: "/admin/auditoria", element: <AuditoriaPages /> },
          { path: "/admin/pendentes", element: <ItensPendentesPages /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
