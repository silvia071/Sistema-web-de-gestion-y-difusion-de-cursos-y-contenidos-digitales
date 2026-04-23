import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { API_BASE } from "../config/api";
import "./DetalleCurso.css";

import jsImg from "../assets/javaScript.png";
import pyImg from "../assets/Python.png";
import javaImg from "../assets/java.png";
import htmlImg from "../assets/html.png";
import cppImg from "../assets/C++.png";
import reactImg from "../assets/react.png";

const imagenes = {
  JavaScript: jsImg,
  Python: pyImg,
  Java: javaImg,
  "HTML y CSS": htmlImg,
  "C++": cppImg,
  React: reactImg,
};

function DetalleCurso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const cargarCurso = async () => {
      try {
        setLoading(true);
        setError("");
        setCurso(null);

        const res = await fetch(`${API_BASE}/api/cursos/${id}`, {
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "No se pudo cargar el curso");
        }

        setCurso(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error al cargar curso:", err);
        setError("Error al cargar el detalle del curso.");
      } finally {
        setLoading(false);
      }
    };

    cargarCurso();

    return () => controller.abort();
  }, [id]);

  const precioFormateado = useMemo(() => {
    if (!curso?.precio) return "$0";
    return `$${curso.precio.toLocaleString("es-AR")}`;
  }, [curso]);

  const obtenerImagenCurso = (cursoActual) => {
    const nombreCategoria = cursoActual?.categoria?.nombre;

    if (cursoActual?.imagenPortada) return cursoActual.imagenPortada;

    if (nombreCategoria && imagenes[nombreCategoria]) {
      return imagenes[nombreCategoria];
    }

    const titulo = cursoActual?.titulo?.toLowerCase() || "";

    if (titulo.includes("javascript")) return jsImg;
    if (titulo.includes("python")) return pyImg;
    if (titulo.includes("java")) return javaImg;
    if (titulo.includes("html")) return htmlImg;
    if (titulo.includes("css")) return htmlImg;
    if (titulo.includes("c++")) return cppImg;
    if (titulo.includes("react")) return reactImg;

    return "/placeholder-curso.png";
  };

  const handleAgregarAlCarrito = () => {
    if (!curso) return;
    agregarAlCarrito({
      ...curso,
      imagen: obtenerImagenCurso(curso),
    });
  };

  if (loading) {
    return (
      <section className="detalle-curso-page">
        <div className="detalle-curso-estado">
          <p>Cargando curso...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="detalle-curso-page">
        <div className="detalle-curso-estado">
          <p>{error}</p>
          <button className="btn-volver" onClick={() => navigate("/cursos")}>
            ← Volver a cursos
          </button>
        </div>
      </section>
    );
  }

  if (!curso) {
    return (
      <section className="detalle-curso-page">
        <div className="detalle-curso-estado">
          <p>No se encontró el curso.</p>
          <button className="btn-volver" onClick={() => navigate("/cursos")}>
            ← Volver a cursos
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="detalle-curso-page">
      <div className="detalle-curso-top">
        <button className="btn-volver-cta" onClick={() => navigate("/cursos")}>
          ← Volver a cursos
        </button>
      </div>

      <div className="detalle-curso-card">
        <div className="detalle-curso-imagen">
          <img
            src={obtenerImagenCurso(curso)}
            alt={curso.titulo || "Curso"}
            onError={(e) => {
              e.currentTarget.src = "/placeholder-curso.png";
            }}
          />
        </div>

        <div className="detalle-curso-info">
          <span className="detalle-curso-categoria">
            {curso.categoria?.nombre || "Sin categoría"}
          </span>

          <h1>{curso.titulo || "Curso sin título"}</h1>

          <p className="detalle-curso-descripcion">
            {curso.descripcion || "Este curso no tiene descripción disponible."}
          </p>

          <div className="detalle-curso-meta">
            <span>Nivel: {curso.nivel || "No especificado"}</span>
            <span>Duración: {curso.duracion || "No especificada"}</span>
          </div>

          <p className="detalle-curso-precio">{precioFormateado}</p>

          <button
            className="btn btn-primary detalle-curso-btn"
            onClick={handleAgregarAlCarrito}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      <div className="detalle-curso-extra">
        <div className="detalle-curso-bloque">
          <h2>Qué vas a aprender</h2>

          {Array.isArray(curso.aprendizajes) &&
          curso.aprendizajes.length > 0 ? (
            <ul className="detalle-curso-lista aprendizajes-lista">
              {curso.aprendizajes.map((item, index) => (
                <li key={index}>✔ {item}</li>
              ))}
            </ul>
          ) : (
            <p className="detalle-curso-vacio">
              No hay aprendizajes cargados para este curso.
            </p>
          )}
        </div>

        <div className="detalle-curso-bloque">
          <h2>Lecciones incluidas</h2>

          {Array.isArray(curso.lecciones) && curso.lecciones.length > 0 ? (
            <ul className="detalle-curso-lista lecciones-lista">
              {curso.lecciones.map((leccion, index) => (
                <li
                  key={leccion?._id || index}
                  className="leccion-item"
                  onClick={() => navigate(`/lecciones/${leccion._id}`)}
                >
                  <span className="leccion-numero">{index + 1}</span>

                  <div className="leccion-info">
                    <span className="leccion-titulo">
                      {leccion?.titulo || "Lección sin título"}
                    </span>

                    <span className="leccion-duracion">
                      {leccion?.duracionMinutos || 0} min
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="detalle-curso-vacio">
              No hay lecciones cargadas para este curso.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default DetalleCurso;
