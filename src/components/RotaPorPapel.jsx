import { Navigate, Outlet, useOutletContext } from "react-router-dom";

function RotaPorPapel({ papeis }) {
  const contexto = useOutletContext();

  if (!papeis.includes(contexto.usuario?.papel)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={contexto} />;
}

export default RotaPorPapel;
