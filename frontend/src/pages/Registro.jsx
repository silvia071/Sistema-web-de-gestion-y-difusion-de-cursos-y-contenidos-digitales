import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE, USE_MOCK_API } from "../config/api";
import "./Registro.css";

function Registro() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const nombre = e.target.nombre.value.trim();
    const apellido = e.target.apellido.value.trim();
    const email = e.target.email.value.trim();
    const contrasenia = e.target.password.value;

    if (!nombre || !apellido || !email || !contrasenia) {
      setError("Completá todos los campos.");
      return;
    }

    if (USE_MOCK_API) {
      setSuccess("Usuario registrado correctamente.");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/usuarios/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          contrasenia,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data.detalle ||
          data.mensaje ||
          data.error ||
          "No se pudo registrar el usuario.";
        setError(msg);
        return;
      }

      setSuccess("Usuario registrado correctamente.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error(err);
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="registro-page">
      <div className="registro-card">
        <div className="registro-header">
          <p className="registro-kicker">Crear cuenta</p>
          <h1 className="registro-title">Registrate en Mundo Dev</h1>
          <p className="registro-subtitle">
            Completá tus datos para acceder a cursos, compras y contenido.
          </p>
        </div>

        <form className="registro-form" onSubmit={handleSubmit}>
          {error && (
            <p className="registro-alert registro-alert-error">{error}</p>
          )}
          {success && (
            <p className="registro-alert registro-alert-success">{success}</p>
          )}

          <div className="registro-row">
            <div className="registro-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="registro-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div className="registro-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="registro-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresá una contraseña"
              required
            />
          </div>

          <button className="registro-btn" type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="registro-login-text">
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </section>
  );
}

export default Registro;
