import { useParams, useNavigate } from "react-router-dom";

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
    },
    {
      id: "2",
      titulo: "Qué es React y para qué sirve",
      contenido:
        "React es una librería de JavaScript que permite construir interfaces de usuario de manera eficiente...",
      categoria: "Frontend",
      fecha: "07/04/2026",
    },
    {
      id: "3",
      titulo: "Buenas prácticas en desarrollo web",
      contenido:
        "Organizar el código, usar buenas convenciones y mantener una estructura clara es clave para proyectos escalables...",
      categoria: "Desarrollo Web",
      fecha: "06/04/2026",
    },
  ];

  const publicacion = publicaciones.find((p) => p.id === id);

  if (!publicacion) {
    return <h2>Publicación no encontrada</h2>;
  }

  return (
    <div
      style={{
        padding: "60px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        lineHeight: "1.6",
        color: "white",
      }}
    >
      <button
        onClick={() => navigate("/blog")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#6c63ff",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Volver
      </button>

      <h1 style={{ marginBottom: "10px" }}>{publicacion.titulo}</h1>

      <p style={{ color: "#bbb", marginBottom: "20px" }}>
        <strong>{publicacion.categoria}</strong> - {publicacion.fecha}
      </p>

      <p style={{ fontSize: "1.05rem" }}>{publicacion.contenido}</p>
    </div>
  );
}

export default BlogDetalle;
