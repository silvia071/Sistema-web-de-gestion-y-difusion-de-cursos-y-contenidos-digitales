import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../config/api";
import "./AprenderCurso.css";

function AprenderCurso() {
  const { id } = useParams();

  const [curso, setCurso] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);

  useEffect(() => {
    const cargarCurso = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cursos/${id}`);
        const data = await res.json();

        setCurso(data);

        if (data.lecciones?.length > 0) {
          setLeccionActual(data.lecciones[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    cargarCurso();
  }, [id]);

  if (!curso) return <p>Cargando curso...</p>;

  return (
    <div className="player-page">
      <div className="player-sidebar">
        <h3>{curso.titulo}</h3>

        {curso.lecciones?.map((leccion, index) => (
          <div
            key={leccion._id}
            className={`leccion-item ${
              leccionActual?._id === leccion._id ? "activa" : ""
            }`}
            onClick={() => setLeccionActual(leccion)}
          >
            {index + 1}. {leccion.titulo}
          </div>
        ))}
      </div>

      <div className="player-content">
        {leccionActual ? (
          <>
            <h2>{leccionActual.titulo}</h2>
            <p>{leccionActual.descripcion}</p>
            <p>Duración: {leccionActual.duracionMinutos} min</p>
          </>
        ) : (
          <p>No hay lecciones</p>
        )}
      </div>
    </div>
  );
}

export default AprenderCurso;
