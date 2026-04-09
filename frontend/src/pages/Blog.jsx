import { useNavigate } from "react-router-dom";
import "./Blog.css";

function Blog() {
  const navigate = useNavigate();

  const publicaciones = [
    {
      id: 1,
      titulo: "Introducción a JavaScript",
      resumen: "Conceptos básicos para empezar a programar en JavaScript.",
      categoria: "Programación",
      fecha: "08/04/2026",
      imagen: "https://picsum.photos/400/200?1",
    },
    {
      id: 2,
      titulo: "Qué es React y para qué sirve",
      resumen: "Una explicación simple sobre React y sus ventajas.",
      categoria: "Frontend",
      fecha: "07/04/2026",
      imagen: "https://picsum.photos/400/200?2",
    },
    {
      id: 3,
      titulo: "Buenas prácticas en desarrollo web",
      resumen: "Consejos útiles para organizar mejor tus proyectos.",
      categoria: "Desarrollo Web",
      fecha: "06/04/2026",
      imagen: "https://picsum.photos/400/200?3",
    },
  ];
  return (
    <section className="blog-page">
      <h1 className="blog-title">Blog</h1>
      <p className="blog-subtitle">
        Descubrí artículos, novedades y recursos sobre programación y
        tecnología.
      </p>

      <div className="blog-grid">
        {publicaciones.map((pub) => (
          <div
            key={pub.id}
            className="blog-card"
            onClick={() => navigate(`/blog/${pub.id}`)}
          >
            <img src={pub.imagen} alt={pub.titulo} className="blog-image" />
            <span className="blog-category">{pub.categoria}</span>
            <h2>{pub.titulo}</h2>
            <p>{pub.resumen}</p>
            <small>{pub.fecha}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Blog;
