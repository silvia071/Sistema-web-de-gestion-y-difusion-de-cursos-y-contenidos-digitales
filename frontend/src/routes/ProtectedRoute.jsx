import { Navigate, useLocation } from "react-router-dom";

function obtenerPayloadToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function tokenExpirado(token) {
  const payload = obtenerPayloadToken(token);

  if (!payload) return true;

  if (!payload.exp) return false;

  return payload.exp * 1000 < Date.now();
}

function limpiarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("rol");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("nombre");
  localStorage.removeItem("apellido");
  localStorage.removeItem("nombreCompleto");
  localStorage.removeItem("carrito");
}

function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  const haySesion =
    token && token !== "null" && token !== "undefined" && token.trim() !== "";

  if (!haySesion || tokenExpirado(token)) {
    limpiarSesion();

    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const payload = obtenerPayloadToken(token);
  const esAdmin = payload?.rol === "ADMINISTRADOR";

  if (adminOnly && !esAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
