import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) return;

    localStorage.setItem("token", "usuario_logueado");
    localStorage.setItem("email", email);

    navigate("/perfil");
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
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button className="login-btn" type="submit">
            Ingresar
          </button>
        </form>

        <p className="login-register-text">
          ¿No tenés cuenta?{" "}
          <span
            className="login-register-link"
            onClick={() => navigate("/registro")}
          >
            Registrate
          </span>
        </p>
      </div>
    </section>
  );
}

export default Login;
