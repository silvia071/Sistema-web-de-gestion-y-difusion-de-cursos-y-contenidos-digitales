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
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerMisCursos = async () => {
      try {
        const usuarioId = localStorage.getItem("userId");

        if (!usuarioId) {
          setAccesos([]);
          return;
        }

        const res = await fetch(
          `${API_BASE}/api/acceso-curso/usuario/${usuarioId}`,
        );

        const data = await res.json();

        // ✔ ordenar por progreso
        const ordenados = (Array.isArray(data) ? data : []).sort(
          (a, b) => (b.progreso || 0) - (a.progreso || 0),
        );

        setAccesos(ordenados);
      } catch (error) {
        console.error("Error al obtener mis cursos:", error);
        setAccesos([]);
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

  // 🔥 curso principal (el primero no completado)
  const cursoPrincipal = accesos.find((a) => (a.progreso || 0) < 100);

  if (loading) {
    return (
      <main className="mis-cursos-page">
        <h1>Mis cursos</h1>

        {/* 🔥 skeleton */}
        <section className="mis-cursos-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="mis-cursos-page">
      <h1>Mis cursos</h1>

      {/* 🔥 CONTINUAR APRENDIENDO */}
      {cursoPrincipal && cursoPrincipal.curso && (
        <section className="mis-cursos-featured">
          <h2>Continuar aprendiendo</h2>

          <div className="featured-card">
            <img
              src={obtenerImagenCurso(cursoPrincipal.curso)}
              alt={cursoPrincipal.curso.titulo}
            />

            <div className="featured-content">
              <h3>{cursoPrincipal.curso.titulo}</h3>

              <p>
                Continuar desde lección{" "}
                {(cursoPrincipal.ultimaLeccion ?? 0) + 1}
              </p>

              <div className="mis-curso-progress">
                <div
                  className="mis-curso-progress-fill animate"
                  style={{ width: `${cursoPrincipal.progreso || 0}%` }}
                />
              </div>

              <button
                className="btn-continuar-grande"
                onClick={() => entrarAlCurso(cursoPrincipal.curso._id)}
              >
                Continuar →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🔥 LISTADO */}
      {accesos.length === 0 ? (
        <div className="mis-cursos-empty">
          <h3>No tenés cursos todavía</h3>
          <p>Explorá los cursos y empezá a aprender 🚀</p>

          <button className="btn-explorar" onClick={() => navigate("/cursos")}>
            Ver cursos
          </button>
        </div>
      ) : (
        <section className="mis-cursos-grid">
          {accesos.map((acceso) => {
            const curso = acceso.curso;
            if (!curso) return null;

            const completado = (acceso.progreso || 0) >= 100;

            return (
              <article key={acceso._id} className="mis-curso-card">
                <div className="mis-curso-img">
                  <img src={obtenerImagenCurso(curso)} alt={curso.titulo} />
                </div>

                <div className="mis-curso-content">
                  <h3>{curso.titulo}</h3>

                  {completado && (
                    <span className="badge-completado">✔ Completado</span>
                  )}

                  <div className="mis-curso-progress">
                    <div
                      className="mis-curso-progress-fill animate"
                      style={{ width: `${acceso.progreso || 0}%` }}
                    />
                  </div>

                  <p className="mis-curso-progreso-texto">
                    Progreso: {acceso.progreso || 0}%
                  </p>

                  {!completado && (
                    <p className="mis-curso-continuar">
                      Continuar desde lección {(acceso.ultimaLeccion ?? 0) + 1}
                    </p>
                  )}

                  <button
                    className="btn-entrar"
                    onClick={() => entrarAlCurso(curso._id)}
                  >
                    {completado ? "Ver curso" : "Continuar"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
