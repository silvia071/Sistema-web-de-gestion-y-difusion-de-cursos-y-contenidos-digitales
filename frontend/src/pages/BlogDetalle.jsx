import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import "./BlogDetalle.css";

function BlogDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [publicacion, setPublicacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPublicacion = async () => {
      try {
        setError("");

        const response = await api.get(`/api/publicaciones/${id}`);
        setPublicacion(response.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.mensaje || "Error al cargar la publicación.",
        );
      } finally {
        setLoading(false);
      }
    };

    cargarPublicacion();
  }, [id]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-AR");
  };

  const obtenerCategoria = (pub) => {
    return pub.categoria?.nombre || "Sin categoría";
  };

  if (loading) {
    return (
      <section className="blog-detalle-page">
        <article className="blog-detalle-card">
          <div className="blog-detalle-inner">
            <h2>Cargando publicación...</h2>
          </div>
        </article>
      </section>
    );
  }

  if (error || !publicacion) {
    return (
      <section className="blog-detalle-page">
        <article className="blog-detalle-card">
          <div className="blog-detalle-inner">
            <button
              className="blog-detalle-btn"
              onClick={() => navigate("/blog")}
            >
              ← Volver
            </button>

            <h2>{error || "Publicación no encontrada."}</h2>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="blog-detalle-page">
      <article className="blog-detalle-card">
        <div className="blog-detalle-inner">
          <button
            className="blog-detalle-btn"
            onClick={() => navigate("/blog")}
          >
            ← Volver
          </button>

          <img
            src={getImageUrl(publicacion.imagen)}
            alt={publicacion.titulo}
            className="blog-detalle-img"
          />

          <span className="blog-detalle-badge">
            {obtenerCategoria(publicacion)}
          </span>

          <h1>{publicacion.titulo}</h1>

          <div className="blog-detalle-meta">
            <span>
              📅{" "}
              {formatearFecha(
                publicacion.fechaPublicacion || publicacion.createdAt,
              )}
            </span>
            <span>•</span>
            <span>🕒 5 min de lectura</span>
          </div>

          <div className="blog-detalle-divider" />

          <div className="blog-detalle-contenido">
            <p>{publicacion.contenido || "Sin contenido disponible."}</p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default BlogDetalle;
