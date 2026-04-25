import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import "./MisCursos.css";

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

  if (loading) {
    return (
      <main className="mis-cursos-page">
        <h1>Mis cursos</h1>
        <p>Cargando cursos...</p>
      </main>
    );
  }

  return (
    <main className="mis-cursos-page">
      <h1>Mis cursos</h1>

      {cursos.length === 0 ? (
        <p>No tenés cursos todavía</p>
      ) : (
        <section className="mis-cursos-grid">
          {cursos.map((curso) => (
            <article key={curso._id} className="mis-curso-card">
              <div className="mis-curso-content">
                <h3>{curso.titulo}</h3>
                <p>{curso.descripcion}</p>

                <div className="mis-curso-meta">
                  <span>{curso.duracion}</span>
                  <span>{curso.nivel}</span>
                </div>

                <button
                  className="btn-entrar"
                  onClick={() => entrarAlCurso(curso._id)}
                >
                  Entrar al curso
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
