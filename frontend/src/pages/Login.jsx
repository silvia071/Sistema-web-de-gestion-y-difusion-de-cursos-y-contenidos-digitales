import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { USE_MOCK_API } from "../config/api";
import api from "../services/api";
import { readMockPerfil, writeMockPerfil } from "../services/mockPerfil";
import { useCarrito } from "../context/CarritoContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { recargarCarrito } = useCarrito();

  const from = location.state?.from || "/";
  const emailInicial = location.state?.email || "";

  const [form, setForm] = useState({
    email: emailInicial,
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (emailInicial) {
      setForm((prev) => ({
        ...prev,
        email: emailInicial,
      }));
    }
  }, [emailInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const limpiarSesionAnterior = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("nombre");
    localStorage.removeItem("apellido");
    localStorage.removeItem("nombreCompleto");
    localStorage.removeItem("carrito");
  };

  const guardarSesion = (token, usuario) => {
    if (!token || !usuario) {
      throw new Error("Respuesta de login inválida");
    }

    const usuarioId = usuario.id || usuario._id;

    if (!usuarioId) {
      throw new Error("No se pudo obtener el ID del usuario");
    }

    limpiarSesionAnterior();

    const nombre = usuario.nombre || "Usuario";
    const apellido = usuario.apellido || "";
    const nombreCompleto = `${nombre} ${apellido}`.trim();

    localStorage.setItem("token", token);
    localStorage.setItem("userId", usuarioId);
    localStorage.setItem("email", usuario.email || "");
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("apellido", apellido);
    localStorage.setItem("nombreCompleto", nombreCompleto);
    localStorage.setItem("rol", usuario.rol || "CLIENTE");
    localStorage.setItem("usuario", JSON.stringify(usuario));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Completá todos los campos.");
      return;
    }

    if (USE_MOCK_API) {
      const perfil = readMockPerfil(email);

      const perfilMock = perfil || {
        id: "local",
        email,
        nombre: "Usuario",
        apellido: "",
        rol: "CLIENTE",
      };

      writeMockPerfil(perfilMock);

      guardarSesion("mock_session", {
        id: "local",
        email,
        nombre: perfilMock.nombre || "Usuario",
        apellido: perfilMock.apellido || "",
        rol: perfilMock.rol || "CLIENTE",
      });

      recargarCarrito();
      navigate(from, { replace: true });
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        contrasenia: password,
      });

      const token = data.token || data.datos?.token;
      const usuario = data.usuario || data.datos?.usuario;

      guardarSesion(token, usuario);

      recargarCarrito();
      navigate(from, { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.detalle ||
          error.response?.data?.mensaje ||
          error.message ||
          "No se pudo iniciar sesión.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Iniciar sesión</h1>
          <p className="login-subtitle">
            Accedé a tu cuenta para ver tus cursos y tu perfil.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}

          <div className="login-group">
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              className="login-input"
              type="email"
              placeholder="Ingresá tu email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-group">
            <label className="login-label" htmlFor="password">
              Contraseña
            </label>

            <div className="login-password-wrap">
              <input
                id="password"
                name="password"
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={submitting}>
            {submitting ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="login-register-text">
          ¿No tenés cuenta?{" "}
          <Link className="login-register-link" to="/registro">
            Registrate
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
