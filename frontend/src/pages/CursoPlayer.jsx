import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import "./CursoPlayer.css";

export default function CursoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [leccionActual, setLeccionActual] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [accesoId, setAccesoId] = useState(null);

  const usuarioId = localStorage.getItem("userId");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resCurso = await fetch(`${API_BASE}/api/cursos/${id}`);
        const dataCurso = await resCurso.json();

        const leccionesOrdenadas = [...(dataCurso.lecciones || [])].sort(
          (a, b) => a.orden - b.orden,
        );

        const cursoConLeccionesOrdenadas = {
          ...dataCurso,
          lecciones: leccionesOrdenadas,
        };

        setCurso(cursoConLeccionesOrdenadas);

        const resAcceso = await fetch(
          `${API_BASE}/api/acceso-curso/usuario/${usuarioId}`,
        );

        const accesos = await resAcceso.json();
        let acceso = accesos.find((a) => a.curso._id === id);

        // 🔹 si no existe → crear
        if (!acceso) {
          const resNuevo = await fetch(`${API_BASE}/api/acceso-curso`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuarioId,
              cursoId: id,
            }),
          });

          acceso = await resNuevo.json();
        }

        setAccesoId(acceso._id);

        if (leccionesOrdenadas.length > 0) {
          const progresoGuardado = acceso.progreso || 0;
          setProgreso(progresoGuardado);

          // 🔥 USAR ultimaLeccion SI EXISTE
          const indexInicial =
            acceso.ultimaLeccion != null
              ? acceso.ultimaLeccion
              : Math.floor(
                  (progresoGuardado / 100) * leccionesOrdenadas.length,
                );

          const indexSeguro = Math.min(
            indexInicial,
            leccionesOrdenadas.length - 1,
          );

          setLeccionActual(indexSeguro);
        }
      } catch (error) {
        console.error("Error al cargar el curso:", error);
      }
    };

    cargarDatos();
  }, [id, usuarioId]);

  // 🔹 actualizar progreso + ultima leccion
  const actualizarProgreso = async (nuevoProgreso, index) => {
    try {
      if (!accesoId) return;

      await fetch(`${API_BASE}/api/acceso-curso/${accesoId}/progreso`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          progreso: nuevoProgreso,
          ultimaLeccion: index,
        }),
      });
    } catch (error) {
      console.error("Error al actualizar progreso:", error);
    }
  };

  const calcularProgreso = (index) => {
    if (!curso || curso.lecciones.length === 0) return 0;
    return Math.round(((index + 1) / curso.lecciones.length) * 100);
  };

  // 🔥 CLICK → guarda lección exacta
  const handleSeleccionarLeccion = (index) => {
    setLeccionActual(index);

    const nuevoProgreso = calcularProgreso(index);
    setProgreso(nuevoProgreso);
    actualizarProgreso(nuevoProgreso, index);
  };

  const handleAnteriorLeccion = () => {
    if (!curso || curso.lecciones.length === 0) return;

    const nuevoIndex = leccionActual - 1;

    if (nuevoIndex >= 0) {
      setLeccionActual(nuevoIndex);

      const nuevoProgreso = calcularProgreso(nuevoIndex);
      setProgreso(nuevoProgreso);
      actualizarProgreso(nuevoProgreso, nuevoIndex);
    }
  };

  const handleSiguienteLeccion = () => {
    if (!curso || curso.lecciones.length === 0) return;

    const total = curso.lecciones.length;
    const nuevoIndex = Math.min(leccionActual + 1, total - 1);

    setLeccionActual(nuevoIndex);

    const nuevoProgreso = calcularProgreso(nuevoIndex);
    setProgreso(nuevoProgreso);
    actualizarProgreso(nuevoProgreso, nuevoIndex);
  };

  if (!curso) return <p>Cargando...</p>;

  if (!curso.lecciones || curso.lecciones.length === 0) {
    return (
      <div className="curso-player">
        <div className="curso-player-content">
          <button
            className="curso-player-back"
            onClick={() => navigate("/cursos")}
          >
            ← Volver a cursos
          </button>

          <h1>{curso.titulo}</h1>
          <p>Este curso todavía no tiene lecciones cargadas.</p>
        </div>
      </div>
    );
  }

  const leccion = curso.lecciones[leccionActual];

  return (
    <div className="curso-player">
      <div className="curso-player-sidebar">
        <h3>{curso.titulo}</h3>

        {curso.lecciones.map((l, i) => {
          const estaActiva = i === leccionActual;
          const estaCompleta = i < leccionActual;

          return (
            <div
              key={l._id}
              onClick={() => handleSeleccionarLeccion(i)}
              className={`curso-player-item ${estaActiva ? "active" : ""} ${
                estaCompleta ? "done" : ""
              }`}
            >
              <span className="curso-player-icon">
                {estaCompleta ? "✔" : estaActiva ? "▶" : "•"}
              </span>

              <span>
                {i + 1}. {l.titulo}
              </span>
            </div>
          );
        })}
      </div>

      <div className="curso-player-content">
        <button
          className="curso-player-back"
          onClick={() => navigate("/cursos")}
        >
          ← Volver a cursos
        </button>

        <div className="curso-player-header">
          <span className="curso-player-badge">
            Lección {leccionActual + 1} de {curso.lecciones.length}
          </span>

          {leccion.duracionMinutos && (
            <span className="curso-player-badge">
              {leccion.duracionMinutos} min
            </span>
          )}
        </div>

        <h1>{leccion.titulo}</h1>

        <p className="curso-player-descripcion">{leccion.descripcion}</p>

        {leccion.videoUrl && (
          <div className="curso-player-video">
            <iframe src={leccion.videoUrl} title="Video" allowFullScreen />
          </div>
        )}

        <div className="curso-player-texto">{leccion.contenido}</div>

        <div className="curso-player-progress">
          <div
            className="curso-player-progress-bar"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <p className="curso-player-progreso-texto">Progreso: {progreso}%</p>

        <div className="curso-player-actions">
          <button
            className="curso-player-back curso-player-prev"
            onClick={handleAnteriorLeccion}
            disabled={leccionActual === 0}
          >
            ← Anterior
          </button>

          <button
            className="curso-player-btn"
            onClick={handleSiguienteLeccion}
            disabled={progreso >= 100}
          >
            {progreso >= 100 ? "Curso completado ✔" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}
