import { useState } from "react";
import api from "../services/api";
import "./Contactos.css";

function Contactos() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setEnviando(true);
      setError("");
      setExito("");

      await api.post("/api/mensajes", form);

      setExito("Mensaje enviado correctamente.");

      setForm({
        nombre: "",
        email: "",
        mensaje: "",
      });
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.mensaje ||
          "No se pudo enviar el mensaje. Intentá nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="contacto-page">
      <div className="contacto-container">
        <div className="contacto-header">
          <span className="contacto-badge">💬 Estamos para ayudarte</span>
          <h1>Contacto</h1>
          <p>
            ¿Tenés alguna consulta? Escribinos y te responderemos lo antes
            posible.
          </p>
        </div>

        <div className="contacto-grid">
          <form className="contacto-form" onSubmit={handleSubmit}>
            <h2>✉️ Envianos un mensaje</h2>

            <div className="contacto-form-row">
              <input
                type="text"
                name="nombre"
                placeholder="👤 Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="✉️ Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="mensaje"
              placeholder="💬 Mensaje"
              rows="5"
              value={form.mensaje}
              onChange={handleChange}
              required
            />

            {error && <p className="contacto-error">{error}</p>}
            {exito && <p className="contacto-exito">{exito}</p>}

            <button type="submit" className="contacto-btn" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar mensaje 🚀"}
            </button>
          </form>

          <div className="contacto-info">
            <h2>ⓘ Información de contacto</h2>

            <div className="contacto-info-item">
              <span>✉️</span>
              <div>
                <strong>Email</strong>
                <p>contacto@mundodev.com</p>
              </div>
            </div>

            <div className="contacto-info-item">
              <span>📍</span>
              <div>
                <strong>Ubicación</strong>
                <p>Argentina</p>
              </div>
            </div>

            <div className="contacto-info-item">
              <span>🕘</span>
              <div>
                <strong>Horario</strong>
                <p>Lunes a Viernes</p>
              </div>
            </div>

            <div className="contacto-info-note">
              Respondemos normalmente dentro de las 24 horas hábiles.
            </div>
          </div>
        </div>

        <div className="contacto-faq">
          <h2>❔ Preguntas frecuentes</h2>

          <div className="contacto-faq-grid">
            <article>
              <h3>¿En cuánto tiempo responden?</h3>
              <p>
                Respondemos todos los mensajes en menos de 24 horas hábiles.
              </p>
            </article>

            <article>
              <h3>¿Puedo colaborar con ustedes?</h3>
              <p>
                Sí. Escribinos y te contamos cómo podés ser parte de Mundo Dev.
              </p>
            </article>

            <article>
              <h3>¿Tienen soporte técnico?</h3>
              <p>
                Sí, nuestro equipo está disponible para ayudarte con cualquier
                inconveniente.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contactos;
