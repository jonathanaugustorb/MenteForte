import { Navigate, Outlet, useOutletContext } from "react-router-dom";

function RotaProtegida() {
  const contexto = useOutletContext();

  if (!contexto.usuario) return <Navigate to="/" replace />;

  return <Outlet context={contexto} />;
}

export default RotaProtegida;
