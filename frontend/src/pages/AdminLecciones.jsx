import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminCursos.css";

function AdminLecciones() {
  const [cursos, setCursos] = useState([]);
  const [lecciones, setLecciones] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    videoUrl: "",
    duracionMinutos: "",
    orden: "",
    estado: "PUBLICADO",
  });

  const obtenerLecciones = async (cursoId) => {
    if (!cursoId) {
      setLecciones([]);
      return;
    }

    try {
      const response = await api.get(`/api/lecciones/admin/curso/${cursoId}`);

      setLecciones(response.data.datos || []);
    } catch (error) {
      console.error("ERROR OBTENIENDO LECCIONES:", error);
      setLecciones([]);
    }
  };
  useEffect(() => {
    const cargarCursosIniciales = async () => {
      try {
        const response = await api.get("/api/cursos/admin/todos");

        setCursos(response.data.datos || []);
      } catch (error) {
        console.error("ERROR OBTENIENDO CURSOS:", error);
      }
    };

    cargarCursosIniciales();
  }, []);

  useEffect(() => {
    const cargarLeccionesDelCurso = async () => {
      if (!cursoSeleccionado) {
        setLecciones([]);
        return;
      }

      try {
        const response = await api.get(
          `/api/lecciones/admin/curso/${cursoSeleccionado}`,
        );

        setLecciones(response.data.datos || []);
      } catch (error) {
        console.error("ERROR OBTENIENDO LECCIONES:", error);
        setLecciones([]);
      }
    };

    cargarLeccionesDelCurso();
  }, [cursoSeleccionado]);

  const limpiarForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      contenido: "",
      videoUrl: "",
      duracionMinutos: "",
      orden: "",
      estado: "PUBLICADO",
    });

    setEditandoId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarLeccion = async (e) => {
    e.preventDefault();

    if (!cursoSeleccionado) {
      alert("Seleccioná un curso");
      return;
    }

    const payload = {
      ...form,
      curso: cursoSeleccionado,
      duracionMinutos: Number(form.duracionMinutos),
      orden: Number(form.orden),
    };

    try {
      if (editandoId) {
        await api.put(`/api/lecciones/${editandoId}`, payload);
      } else {
        await api.post("/api/lecciones", payload);
      }

      alert(
        editandoId
          ? "Lección editada correctamente"
          : "Lección creada correctamente",
      );

      limpiarForm();

      obtenerLecciones(cursoSeleccionado);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.mensaje ||
          error.response?.data?.errores?.join("\n") ||
          "Error al guardar la lección",
      );
    }
  };

  const cargarParaEditar = (leccion) => {
    setEditandoId(leccion._id);

    setForm({
      titulo: leccion.titulo || "",
      descripcion: leccion.descripcion || "",
      contenido: leccion.contenido || "",
      videoUrl: leccion.videoUrl || "",
      duracionMinutos: leccion.duracionMinutos || "",
      orden: leccion.orden || "",
      estado: leccion.estado || "PUBLICADO",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarLeccion = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta lección?",
    );

    if (!confirmar) return;

    try {
      await api.delete(`/api/lecciones/${id}`);

      alert("Lección eliminada correctamente");

      obtenerLecciones(cursoSeleccionado);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.mensaje || "Error al eliminar la lección");
    }
  };

  return (
    <section className="admin-cursos">
      <h1>Gestión de lecciones</h1>

      <form className="admin-form" onSubmit={guardarLeccion}>
        <select
          value={cursoSeleccionado}
          onChange={(e) => {
            setCursoSeleccionado(e.target.value);
            limpiarForm();
          }}
          required
        >
          <option value="">Seleccionar curso</option>

          {cursos.map((curso) => (
            <option key={curso._id} value={curso._id}>
              {curso.titulo}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="titulo"
          placeholder="Título de la lección"
          value={form.titulo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contenido"
          placeholder="Contenido"
          value={form.contenido}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="videoUrl"
          placeholder="URL del video"
          value={form.videoUrl}
          onChange={handleChange}
        />

        <input
          type="number"
          min="1"
          name="duracionMinutos"
          placeholder="Duración en minutos"
          value={form.duracionMinutos}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          min="1"
          name="orden"
          placeholder="Orden"
          value={form.orden}
          onChange={handleChange}
          required
        />

        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="PUBLICADO">Publicado</option>
          <option value="BORRADOR">Borrador</option>
          <option value="OCULTO">Oculto</option>
        </select>

        <button type="submit">
          {editandoId ? "Guardar cambios" : "Crear lección"}
        </button>

        {editandoId && (
          <button type="button" onClick={limpiarForm}>
            Cancelar
          </button>
        )}
      </form>

      <div className="admin-list">
        {lecciones.length === 0 ? (
          <p>No hay lecciones cargadas</p>
        ) : (
          lecciones.map((leccion) => (
            <div key={leccion._id} className="admin-item">
              <div>
                <h3>
                  {leccion.orden}. {leccion.titulo}
                </h3>

                <p>{leccion.descripcion}</p>

                <small>
                  Duración: {leccion.duracionMinutos} min
                  {" | "}
                  Estado: {leccion.estado}
                </small>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button onClick={() => cargarParaEditar(leccion)}>
                  Editar
                </button>

                <button
                  onClick={() => eliminarLeccion(leccion._id)}
                  style={{
                    background: "#ef4444",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AdminLecciones;
