import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && rol !== "ADMINISTRADOR") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
