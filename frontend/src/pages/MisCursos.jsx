import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import "./MisCursos.css";

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

export default function MisCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerMisCursos = async () => {
      try {
        const usuarioId = localStorage.getItem("userId");

        if (!usuarioId) {
          setCursos([]);
          return;
        }

        const res = await fetch(
          `${API_BASE}/api/acceso-curso/usuario/${usuarioId}`,
        );

        const data = await res.json();

        const cursosComprados = Array.isArray(data)
          ? data.map((acceso) => acceso.curso).filter(Boolean)
          : [];

        setCursos(cursosComprados);
      } catch (error) {
        console.error("Error al obtener mis cursos:", error);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerMisCursos();
  }, []);

  const entrarAlCurso = (id) => {
    navigate(`/curso/${id}/aprender`);
  };

  const obtenerImagenCurso = (curso) => {
    const nombreCategoria = curso.categoria?.nombre;

    if (nombreCategoria && imagenes[nombreCategoria]) {
      return imagenes[nombreCategoria];
    }

    const titulo = curso.titulo?.toLowerCase() || "";

    if (titulo.includes("javascript")) return jsImg;
    if (titulo.includes("python")) return pyImg;
    if (titulo.includes("java")) return javaImg;
    if (titulo.includes("html")) return htmlImg;
    if (titulo.includes("css")) return htmlImg;
    if (titulo.includes("c++")) return cppImg;
    if (titulo.includes("react")) return reactImg;

    return jsImg;
  };

  if (loading) {
    return (
      <main className="mis-cursos-page">
        <h1>Mis cursos</h1>
        <p className="mis-cursos-loading">Cargando cursos...</p>
      </main>
    );
  }

  return (
    <main className="mis-cursos-page">
      <h1>Mis cursos</h1>

      {cursos.length === 0 ? (
        <div className="mis-cursos-empty">
          <h3>No tenés cursos todavía</h3>
          <p>Explorá los cursos y empezá a aprender hoy 🚀</p>

          <button className="btn-explorar" onClick={() => navigate("/cursos")}>
            Ver cursos
          </button>
        </div>
      ) : (
        <section className="mis-cursos-grid">
          {cursos.map((curso) => (
            <article key={curso._id} className="mis-curso-card">
              <div className="mis-curso-img">
                <img src={obtenerImagenCurso(curso)} alt={curso.titulo} />
              </div>

              <div className="mis-curso-content">
                <h3>{curso.titulo}</h3>
                <p>{curso.descripcion}</p>

                <div className="mis-curso-meta">
                  <span>{curso.duracion || "—"}</span>
                  <span>{curso.nivel || "—"}</span>
                </div>

                <button
                  className="btn-entrar"
                  onClick={() => entrarAlCurso(curso._id)}
                >
                  Continuar curso
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
