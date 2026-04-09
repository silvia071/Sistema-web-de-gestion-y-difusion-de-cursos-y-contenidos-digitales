import { useParams, useNavigate } from "react-router-dom";
import "./BlogDetalle.css";

function BlogDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const publicaciones = [
    {
      id: "1",
      titulo: "Introducción a JavaScript",
      contenido:
        "JavaScript es un lenguaje fundamental para el desarrollo web. Permite agregar interactividad a las páginas...",
      categoria: "Programación",
      fecha: "08/04/2026",
      imagen: "https://picsum.photos/800/400?1",
    },
    {
      id: "2",
      titulo: "Qué es React y para qué sirve",
      contenido:
        "React es una librería de JavaScript que permite construir interfaces de usuario de manera eficiente...",
      categoria: "Frontend",
      fecha: "07/04/2026",
      imagen: "https://picsum.photos/800/400?2",
    },
    {
      id: "3",
      titulo: "Buenas prácticas en desarrollo web",
      contenido:
        "Organizar el código, usar buenas convenciones y mantener una estructura clara es clave para proyectos escalables...",
      categoria: "Desarrollo Web",
      fecha: "06/04/2026",
      imagen: "https://picsum.photos/800/400?3",
    },
  ];

  const publicacion = publicaciones.find((p) => p.id === id);

  if (!publicacion) {
    return <h2>Publicación no encontrada</h2>;
  }

  return (
    <div className="blog-detalle">
      <button className="blog-detalle-btn" onClick={() => navigate("/blog")}>
        ← Volver
      </button>

      <img
        src={publicacion.imagen}
        alt={publicacion.titulo}
        className="blog-detalle-img"
      />

      <h1>{publicacion.titulo}</h1>

      <p className="blog-detalle-info">
        <strong>{publicacion.categoria}</strong> - {publicacion.fecha}
      </p>

      <p className="blog-detalle-contenido">{publicacion.contenido}</p>
    </div>
  );
}

export default BlogDetalle;
