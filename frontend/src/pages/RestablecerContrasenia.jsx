import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./RecuperarContrasenia.css";

function RestablecerContrasenia() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!nuevaContrasenia.trim() || !confirmarContrasenia.trim()) {
      setError("Completá ambos campos.");
      return;
    }

    if (nuevaContrasenia.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await api.post(
        `/api/auth/restablecer-contrasenia/${token}`,
        {
          nuevaContrasenia,
        },
      );

      setMensaje(
        respuesta.data.mensaje || "Contraseña restablecida correctamente.",
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
          "El enlace de recuperación es inválido o ya fue utilizado. Generá un nuevo enlace.",
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

        <span className="recuperar-eyebrow">Nueva contraseña</span>

        <h1>Restablecer contraseña</h1>

        <p className="recuperar-description">
          Ingresá una nueva contraseña para recuperar el acceso a tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="recuperar-form">
          <label htmlFor="nuevaContrasenia">Nueva contraseña</label>

          <div className="recuperar-input-wrap">
            <span className="recuperar-input-icon">🔒</span>
            <input
              id="nuevaContrasenia"
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContrasenia}
              onChange={(e) => setNuevaContrasenia(e.target.value)}
            />
          </div>

          <label htmlFor="confirmarContrasenia">Confirmar contraseña</label>

          <div className="recuperar-input-wrap">
            <span className="recuperar-input-icon">🔒</span>
            <input
              id="confirmarContrasenia"
              type="password"
              placeholder="Repetir contraseña"
              value={confirmarContrasenia}
              onChange={(e) => setConfirmarContrasenia(e.target.value)}
            />
          </div>

          {error && <div className="recuperar-alert error">{error}</div>}

          {mensaje && (
            <div className="recuperar-success-card">
              <div className="recuperar-success-icon">✓</div>

              <div className="recuperar-success-content">
                <h3>Contraseña actualizada</h3>
                <p>{mensaje}</p>
              </div>
            </div>
          )}

          <button type="submit" disabled={cargando}>
            <span>
              {cargando ? "Guardando..." : "Guardar nueva contraseña"}
            </span>
            <span className="recuperar-btn-arrow">→</span>
          </button>
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

export default RestablecerContrasenia;
