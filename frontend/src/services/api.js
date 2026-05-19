import axios from "axios";
import { API_BASE } from "../config/api";

const api = axios.create({
  baseURL: API_BASE,
});

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

function tokenValido(token) {
  return (
    token && token !== "null" && token !== "undefined" && token.trim() !== ""
  );
}

function esRutaPrivada(pathname) {
  return (
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/carrito") ||
    pathname.startsWith("/mis-cursos") ||
    pathname.startsWith("/curso/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/pago-exitoso") ||
    pathname.startsWith("/pago-pendiente") ||
    pathname.startsWith("/pago-fallido")
  );
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (tokenValido(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      limpiarSesion();

      const pathname = window.location.pathname;

      if (esRutaPrivada(pathname) && pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
