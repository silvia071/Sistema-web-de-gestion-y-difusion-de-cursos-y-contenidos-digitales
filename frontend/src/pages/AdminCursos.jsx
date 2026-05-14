import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminCursos.css";

const ESTADO_INICIAL_FORM = {
  titulo: "",
  descripcion: "",
  precio: "",
  duracion: "",
  nivel: "",
  categoria: "",
  estado: "BORRADOR",
  imagenPortada: "",
};

function AdminCursos() {
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(ESTADO_INICIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const limpiarForm = () => {
    setForm(ESTADO_INICIAL_FORM);
    setEditandoId(null);
    setError("");
    setMensaje("");
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [cursosResponse, categoriasResponse] = await Promise.all([
        api.get("/api/cursos/admin/todos"),
        api.get("/api/categorias"),
      ]);

      setCursos(cursosResponse.data?.datos || []);
      setCategorias(categoriasResponse.data?.datos || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError(
        error.response?.data?.mensaje ||
          "No se pudieron cargar los datos del administrador.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarForm = () => {
    const errores = [];

    const titulo = form.titulo.trim();
    const descripcion = form.descripcion.trim();
    const duracion = form.duracion.trim();
    const precio = Number(form.precio);

    if (!titulo) errores.push("El título es obligatorio.");
    if (!descripcion) errores.push("La descripción es obligatoria.");
    if (!form.precio) errores.push("El precio es obligatorio.");
    if (Number.isNaN(precio) || precio <= 0) {
      errores.push("El precio debe ser mayor a 0.");
    }
    if (!duracion) errores.push("La duración es obligatoria.");
    if (!form.nivel) errores.push("El nivel es obligatorio.");
    if (!form.categoria) errores.push("La categoría es obligatoria.");
    if (!form.estado) errores.push("El estado es obligatorio.");

    return errores;
  };

  const guardarCurso = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const errores = validarForm();

    if (errores.length > 0) {
      setError(errores.join(" "));
      return;
    }

    const cursoPayload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      duracion: form.duracion.trim(),
      nivel: form.nivel,
      categoria: form.categoria,
      estado: form.estado,
    };

    if (form.imagenPortada.trim()) {
      cursoPayload.imagenPortada = form.imagenPortada.trim();
    }

    try {
      setGuardando(true);

      if (editandoId) {
        await api.put(`/api/cursos/${editandoId}`, cursoPayload);
        setMensaje("Curso editado correctamente.");
      } else {
        await api.post("/api/cursos", cursoPayload);
        setMensaje("Curso creado correctamente.");
      }

      limpiarForm();
      await cargarDatos();
    } catch (error) {
      console.error("Error guardando curso:", error);

      const data = error.response?.data;

      setError(
        data?.errores?.join(" ") ||
          data?.detalle ||
          data?.mensaje ||
          `Error al ${editandoId ? "editar" : "crear"} curso.`,
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCurso = async (id) => {
    const confirma = window.confirm(
      "¿Seguro que querés eliminar este curso? También se eliminarán sus lecciones.",
    );

    if (!confirma) return;

    try {
      setMensaje("");
      setError("");

      await api.delete(`/api/cursos/${id}`);

      setMensaje("Curso eliminado correctamente.");
      await cargarDatos();
    } catch (error) {
      console.error("Error eliminando curso:", error);

      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.detalle ||
          "Error al eliminar curso.",
      );
    }
  };

  const cargarCursoParaEditar = (curso) => {
    setEditandoId(curso._id || curso.id);

    setForm({
      titulo: curso.titulo || "",
      descripcion: curso.descripcion || "",
      precio: curso.precio ?? "",
      duracion: curso.duracion || "",
      nivel: curso.nivel || "",
      categoria:
        typeof curso.categoria === "object"
          ? curso.categoria?._id || curso.categoria?.id || ""
          : curso.categoria || "",
      estado: curso.estado || "BORRADOR",
      imagenPortada: curso.imagenPortada || "",
    });

    setMensaje("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatearNivel = (nivel) => {
    if (!nivel) return "-";
    return nivel.charAt(0) + nivel.slice(1).toLowerCase();
  };

  const formatearEstado = (estado) => {
    if (estado === "PUBLICADO") return "Publicado";
    if (estado === "BORRADOR") return "Borrador";
    if (estado === "OCULTO") return "Oculto";
    return estado || "-";
  };

  if (loading) {
    return (
      <section className="admin-cursos">
        <h1>Gestión de cursos</h1>
        <p>Cargando cursos...</p>
      </section>
    );
  }

  return (
    <section className="admin-cursos">
      <div className="admin-cursos-header">
        <div>
          <h1>Gestión de cursos</h1>
          <p>Creá, editá, publicá u ocultá cursos desde el panel.</p>
        </div>

        <button type="button" onClick={cargarDatos}>
          Recargar
        </button>
      </div>

      {mensaje && <div className="admin-alert success">{mensaje}</div>}
      {error && <div className="admin-alert error">{error}</div>}

      {editandoId && (
        <p className="admin-editando">Editando curso seleccionado</p>
      )}

      <form className="admin-form" onSubmit={guardarCurso}>
        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          rows={4}
          required
        />

        <input
          name="precio"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />

        <input
          name="duracion"
          placeholder="Duración"
          value={form.duracion}
          onChange={handleChange}
          required
        />

        <input
          name="imagenPortada"
          placeholder="URL o ruta de imagen de portada"
          value={form.imagenPortada}
          onChange={handleChange}
        />

        <select
          name="nivel"
          value={form.nivel}
          onChange={handleChange}
          required
        >
          <option value="">Nivel</option>
          <option value="PRINCIPIANTE">Principiante</option>
          <option value="INTERMEDIO">Intermedio</option>
          <option value="AVANZADO">Avanzado</option>
        </select>

        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Categoría</option>

          {categorias.map((cat) => (
            <option key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          required
        >
          <option value="BORRADOR">Borrador</option>
          <option value="PUBLICADO">Publicado</option>
          <option value="OCULTO">Oculto</option>
        </select>

        <button type="submit" disabled={guardando}>
          {guardando
            ? "Guardando..."
            : editandoId
              ? "Guardar cambios"
              : "Crear curso"}
        </button>

        {editandoId && (
          <button type="button" onClick={limpiarForm} disabled={guardando}>
            Cancelar
          </button>
        )}
      </form>

      <div className="admin-list">
        {cursos.length === 0 ? (
          <div className="admin-empty">No hay cursos cargados.</div>
        ) : (
          cursos.map((curso) => (
            <div key={curso._id || curso.id} className="admin-item">
              <div>
                <h3>{curso.titulo}</h3>

                <p>{curso.descripcion}</p>

                <small>
                  Nivel: {formatearNivel(curso.nivel)}
                  {" | "}
                  Precio: ${Number(curso.precio || 0).toLocaleString("es-AR")}
                  {" | "}
                  Estado: {formatearEstado(curso.estado)}
                </small>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => cargarCursoParaEditar(curso)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => eliminarCurso(curso._id || curso.id)}
                  style={{
                    background: "#ef4444",
                    marginLeft: "8px",
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

export default AdminCursos;
