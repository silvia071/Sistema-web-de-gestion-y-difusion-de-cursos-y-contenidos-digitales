import { useEffect, useState } from "react";
import { API_BASE } from "../config/api";
import "./AdminCursos.css";

function AdminCursos() {
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    duracion: "",
    nivel: "",
    categoria: "",
  });

  const token = localStorage.getItem("token");

  const limpiarForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      precio: "",
      duracion: "",
      nivel: "",
      categoria: "",
    });
    setEditandoId(null);
  };

  const obtenerCursos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cursos`);
      const data = await res.json();

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data.cursos)
          ? data.cursos
          : [];

      setCursos(lista);
    } catch (error) {
      console.error("Error cargando cursos", error);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categorias`);
      const data = await res.json();

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data.categorias)
          ? data.categorias
          : [];

      setCategorias(lista);
    } catch (error) {
      console.error("Error cargando categorías", error);
    }
  };

  useEffect(() => {
    obtenerCursos();
    obtenerCategorias();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔴 ELIMINAR CURSO (AFUERA)
  const eliminarCurso = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este curso?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/cursos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Error al eliminar curso");
        return;
      }

      alert("Curso eliminado correctamente");
      obtenerCursos();
    } catch (error) {
      console.error(error);
      alert("Error de red al eliminar curso");
    }
  };

  const guardarCurso = async (e) => {
    e.preventDefault();

    if (
      !form.titulo ||
      !form.descripcion ||
      !form.precio ||
      !form.duracion ||
      !form.nivel ||
      !form.categoria
    ) {
      alert("Completá todos los campos");
      return;
    }

    const cursoPayload = {
      ...form,
      precio: Number(form.precio),
    };

    const url = editandoId
      ? `${API_BASE}/api/cursos/${editandoId}`
      : `${API_BASE}/api/cursos`;

    const method = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cursoPayload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(
          data.detalle ||
            data.mensaje ||
            `Error al ${editandoId ? "editar" : "crear"} curso`,
        );
        return;
      }

      alert(
        editandoId
          ? "Curso editado correctamente"
          : "Curso creado correctamente",
      );

      limpiarForm();
      obtenerCursos();
    } catch (error) {
      console.error(error);
      alert(`Error de red al ${editandoId ? "editar" : "crear"} curso`);
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
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="admin-cursos">
      <h1>Gestión de cursos</h1>

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

        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        />

        <input
          name="precio"
          type="number"
          min="0"
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

        <button type="submit">
          {editandoId ? "Guardar cambios" : "Crear curso"}
        </button>

        {editandoId && (
          <button type="button" onClick={limpiarForm}>
            Cancelar
          </button>
        )}
      </form>

      <div className="admin-list">
        {cursos.map((c) => (
          <div key={c._id || c.id} className="admin-item">
            <div>
              <h3>{c.titulo}</h3>
              <p>{c.descripcion}</p>
              <small>
                Nivel:{" "}
                {c.nivel
                  ? c.nivel.charAt(0) + c.nivel.slice(1).toLowerCase()
                  : "-"}{" "}
                | Precio: ${c.precio?.toLocaleString("es-AR") || 0}
              </small>
            </div>

            <div>
              <button onClick={() => cargarCursoParaEditar(c)}>Editar</button>

              <button
                onClick={() => eliminarCurso(c._id || c.id)}
                style={{ background: "#ef4444", marginLeft: "8px" }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminCursos;
