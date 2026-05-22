import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./RecuperarContrasenia.css";

function RecuperarContrasenia() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enlace, setEnlace] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");
    setEnlace("");

    if (!email.trim()) {
      setError("Ingresá tu email.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await api.post("/api/auth/recuperar-contrasenia", {
        email,
      });

      setMensaje(respuesta.data.mensaje || "Solicitud generada correctamente.");

      if (respuesta.data.enlaceRecuperacion) {
        setEnlace(respuesta.data.enlaceRecuperacion);
      }
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudo generar la recuperación de contraseña.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="recuperar-page">
      <div className="recuperar-bg-glow glow-one"></div>
      <div className="recuperar-bg-glow glow-two"></div>

      <div className="recuperar-card recuperar-card-center">
        <div className="recuperar-icon-orb">
          <span className="recuperar-shield">⌾</span>
        </div>

        <span className="recuperar-eyebrow">Recuperar acceso</span>

        <h1>¿Olvidaste tu contraseña?</h1>

        <p className="recuperar-description">
          Ingresá el email asociado a tu cuenta y te enviaremos un enlace
          temporal para restablecerla.
        </p>

        <form onSubmit={handleSubmit} className="recuperar-form">
          <label htmlFor="email">Email</label>

          <div className="recuperar-input-wrap">
            <span className="recuperar-input-icon">✉</span>
            <input
              id="email"
              type="email"
              placeholder="tuemail@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <div className="recuperar-alert error">{error}</div>}

          {mensaje && (
            <div className="recuperar-success-card">
              <div className="recuperar-success-icon">✓</div>

              <div className="recuperar-success-content">
                <h3>Enlace generado</h3>
                <p>{mensaje}</p>

                {enlace && (
                  <Link
                    className="recuperar-success-link"
                    to={new URL(enlace).pathname}
                  >
                    Restablecer contraseña
                  </Link>
                )}
                <button
                  type="button"
                  className="recuperar-change-email"
                  onClick={() => {
                    setMensaje("");
                    setEnlace("");
                  }}
                >
                  Usar otro email
                </button>
              </div>
            </div>
          )}

          {!mensaje && (
            <button type="submit" disabled={cargando}>
              <span>{cargando ? "Generando..." : "Generar enlace"}</span>
              <span className="recuperar-btn-arrow">→</span>
            </button>
          )}
        </form>

        <div className="recuperar-divider">
          <span></span>
          <small>⌾</small>
          <span></span>
        </div>

        <Link className="recuperar-volver" to="/login">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </section>
  );
}

export default RecuperarContrasenia;
