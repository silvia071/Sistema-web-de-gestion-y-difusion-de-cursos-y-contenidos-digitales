import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, USE_MOCK_API } from "../config/api";

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
        console.log("Respuesta registro:", data);
        const msg =
          data.detalle ||
          data.mensaje ||
          data.error ||
          JSON.stringify(data) ||
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
    <section className="auth-box">
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <div className="form-group">
          <label className="label" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            className="input"
            type="text"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="apellido">
            Apellido
          </label>
          <input
            id="apellido"
            name="apellido"
            className="input"
            type="text"
            placeholder="Tu apellido"
            required
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            className="input"
            type="email"
            placeholder="Tu email"
            required
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            className="input"
            type="password"
            placeholder="Tu contraseña"
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </section>
  );
}

export default Registro;
