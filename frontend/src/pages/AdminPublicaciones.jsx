import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminPublicaciones.css";

const ESTADO_INICIAL_FORM = {
  titulo: "",
  resumen: "",
  contenido: "",
  categoria: "",
  estado: "BORRADOR",
  imagen: "",
  autor: "",
};

function AdminPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState(ESTADO_INICIAL_FORM);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const [modalEliminar, setModalEliminar] = useState(null);

  const formRef = useRef(null);

  const navigate = useNavigate();

  const limpiarForm = () => {
    setForm(ESTADO_INICIAL_FORM);
    setEditandoId(null);
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [pubRes, catRes] = await Promise.all([
        api.get("/api/publicaciones/admin/todas"),
        api.get("/api/categorias"),
      ]);

      setPublicaciones(pubRes.data?.datos || pubRes.data || []);
      setCategorias(catRes.data?.datos || catRes.data || []);
    } catch (err) {
      console.error(err);

      setError("No se pudieron cargar las publicaciones.");
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

    if (!form.titulo.trim()) {
      errores.push("El título es obligatorio.");
    }

    if (!form.contenido.trim()) {
      errores.push("El contenido es obligatorio.");
    }

    if (!form.categoria) {
      errores.push("La categoría es obligatoria.");
    }

    return errores;
  };

  const guardarPublicacion = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    const errores = validarForm();

    if (errores.length > 0) {
      setError(errores.join(" "));
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        titulo: form.titulo.trim(),
        resumen: form.resumen.trim(),
        contenido: form.contenido.trim(),
        categoria: form.categoria,
        estado: form.estado,
        imagen: form.imagen.trim(),
        autor: form.autor.trim(),
      };

      if (editandoId) {
        await api.put(
          `/api/publicaciones/${editandoId}`,
          payload
        );

        setMensaje("Publicación actualizada correctamente.");
      } else {
        await api.post("/api/publicaciones", payload);

        setMensaje("Publicación creada correctamente.");
      }

      limpiarForm();

      await cargarDatos();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.mensaje ||
        "Error al guardar publicación."
      );
    } finally {
      setGuardando(false);
    }
  };

  const cargarParaEditar = (pub) => {
    setEditandoId(pub._id);

    setForm({
      titulo: pub.titulo || "",
      resumen: pub.resumen || "",
      contenido: pub.contenido || "",
      categoria:
        typeof pub.categoria === "object"
          ? pub.categoria._id
          : pub.categoria || "",
      estado: pub.estado || "BORRADOR",
      imagen: pub.imagen || "",
      autor: pub.autor || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarPublicacion = async () => {
    if (!modalEliminar) return;

    try {
      await api.delete(
        `/api/publicaciones/${modalEliminar._id}`
      );

      setMensaje("Publicación eliminada correctamente.");

      setModalEliminar(null);

      await cargarDatos();

    } catch (err) {
      console.error(err);

      setError("Error al eliminar publicación.");
    }
  };

  const publicacionesFiltradas = useMemo(() => {
    return publicaciones.filter((pub) => {

      const coincideBusqueda =
        !busqueda ||
        pub.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        pub.contenido?.toLowerCase().includes(busqueda.toLowerCase());

      const coincideEstado =
        !filtroEstado ||
        pub.estado === filtroEstado;

      const categoriaId =
        typeof pub.categoria === "object"
          ? pub.categoria?._id
          : pub.categoria;

      const coincideCategoria =
        !filtroCategoria ||
        categoriaId === filtroCategoria;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideCategoria
      );
    });
  }, [
    publicaciones,
    busqueda,
    filtroEstado,
    filtroCategoria,
  ]);

  const totalPublicadas = publicaciones.filter(
    (p) => p.estado === "PUBLICADO"
  ).length;

  const totalBorrador = publicaciones.filter(
    (p) => p.estado === "BORRADOR"
  ).length;

  const totalOcultas = publicaciones.filter(
    (p) => p.estado === "OCULTO"
  ).length;

  if (loading) {
    return <h2>Cargando...</h2>;
  }

  return (
    <section className="admin-cursos-page">

      <div className="admin-cursos-shell">

        <header className="admin-cursos-header">

          <div>
            <h1>Gestión de publicaciones</h1>

            <p>
              Administrá artículos y novedades del blog.
            </p>
          </div>

          <div className="admin-header-actions">

            <button
              className="admin-back-btn"
              onClick={() => navigate("/admin")}
            >
              ← Volver
            </button>

            <button
              className="admin-primary-btn"
              onClick={() => {
                limpiarForm();

                setTimeout(() => {
                  formRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
            >
              + Nueva publicación
            </button>

          </div>

        </header>

        {(mensaje || error) && (
          <div className="admin-feedback-zone">

            {mensaje && (
              <div className="admin-alert success">
                {mensaje}
              </div>
            )}

            {error && (
              <div className="admin-alert error">
                {error}
              </div>
            )}

          </div>
        )}

        <section className="admin-cursos-stats">

          <article className="admin-curso-stat-card purple">
            <div className="admin-curso-stat-icon">📰</div>

            <div>
              <span>Total</span>
              <strong>{publicaciones.length}</strong>
            </div>
          </article>

          <article className="admin-curso-stat-card green">
            <div className="admin-curso-stat-icon">◉</div>

            <div>
              <span>Publicadas</span>
              <strong>{totalPublicadas}</strong>
            </div>
          </article>

          <article className="admin-curso-stat-card gold">
            <div className="admin-curso-stat-icon">▣</div>

            <div>
              <span>Borradores</span>
              <strong>{totalBorrador}</strong>
            </div>
          </article>

          <article className="admin-curso-stat-card cyan">
            <div className="admin-curso-stat-icon">◌</div>

            <div>
              <span>Ocultas</span>
              <strong>{totalOcultas}</strong>
            </div>
          </article>

        </section>

        <div className="admin-toolbar">

          <div className="admin-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <label className="admin-filter">

            <span>Estado</span>

            <select
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(e.target.value)
              }
            >
              <option value="">Todos</option>
              <option value="PUBLICADO">Publicado</option>
              <option value="BORRADOR">Borrador</option>
              <option value="OCULTO">Oculto</option>
            </select>

          </label>

          <label className="admin-filter">

            <span>Categoría</span>

            <select
              value={filtroCategoria}
              onChange={(e) =>
                setFiltroCategoria(e.target.value)
              }
            >
              <option value="">Todas</option>

              {categorias.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.nombre}
                </option>
              ))}

            </select>

          </label>

        </div>

        <div className="admin-cursos-dashboard-grid">

          <form
            ref={formRef}
            className="admin-form-card"
            onSubmit={guardarPublicacion}
          >

            <div className="admin-form-card-header">

              <div className="admin-form-icon">
                ✎
              </div>

              <div>
                <h2>
                  {editandoId
                    ? "Editar publicación"
                    : "Nueva publicación"}
                </h2>

                <p>
                  Completá la información del artículo.
                </p>
              </div>

            </div>

            <div className="admin-form-grid">

              <label>
                <span>Título</span>

                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>Resumen</span>

                <textarea
                  name="resumen"
                  value={form.resumen}
                  onChange={handleChange}
                  rows={3}
                />
              </label>

              <label>
                <span>Contenido</span>

                <textarea
                  name="contenido"
                  value={form.contenido}
                  onChange={handleChange}
                  rows={10}
                  required
                />
              </label>

              <label>
                <span>Imagen URL</span>

                <input
                  name="imagen"
                  value={form.imagen}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Autor</span>

                <input
                  name="autor"
                  value={form.autor}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Categoría</span>

                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Seleccionar
                  </option>

                  {categorias.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.nombre}
                    </option>
                  ))}

                </select>
              </label>

              <label>
                <span>Estado</span>

                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value="BORRADOR">
                    Borrador
                  </option>

                  <option value="PUBLICADO">
                    Publicado
                  </option>

                  <option value="OCULTO">
                    Oculto
                  </option>

                </select>
              </label>

            </div>

            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-clean-btn"
                onClick={limpiarForm}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-save-btn"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : editandoId
                  ? "Guardar cambios"
                  : "Crear publicación"}
              </button>

            </div>

          </form>

          <div className="admin-list-card">

            <div className="admin-list-header">

              <div>
                <h2>Publicaciones</h2>

                <p>
                  Publicaciones cargadas.
                </p>
              </div>

              <span>
                {publicacionesFiltradas.length}
              </span>

            </div>

            <div className="admin-list">

              {publicacionesFiltradas.map((pub) => (

                <article
                  className="admin-item"
                  key={pub._id}
                >

                  <div className="admin-course-main">

                    <div className="admin-course-avatar">
                      📰
                    </div>

                    <div>
                      <h3>{pub.titulo}</h3>

                      <p>
                        {pub.resumen ||
                          "Sin resumen"}
                      </p>
                    </div>

                  </div>

                  <div className="admin-course-meta">

                    <div>
                      <span>Estado</span>

                      <strong
                        className={`admin-pill status ${pub.estado?.toLowerCase()}`}
                      >
                        {pub.estado}
                      </strong>
                    </div>

                    <div>
                      <span>Categoría</span>

                      <strong>
                        {pub.categoria?.nombre ||
                          "-"}
                      </strong>
                    </div>

                  </div>

                  <div className="admin-course-actions">

                    <button
                      className="admin-edit-btn"
                      onClick={() =>
                        cargarParaEditar(pub)
                      }
                    >
                      ✎
                    </button>

                    <button
                      className="admin-delete-btn"
                      onClick={() =>
                        setModalEliminar(pub)
                      }
                    >
                      🗑
                    </button>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </div>

      </div>

      {modalEliminar && (

        <div className="admin-modal-overlay">

          <div className="admin-modal-card">

            <div className="admin-modal-icon">
              🗑
            </div>

            <h2>Eliminar publicación</h2>

            <p>
              ¿Seguro que querés eliminar:
              <strong>
                {" "}
                {modalEliminar.titulo}
              </strong>
              ?
            </p>

            <div className="admin-modal-actions">

              <button
                className="admin-modal-cancel"
                onClick={() =>
                  setModalEliminar(null)
                }
              >
                Cancelar
              </button>

              <button
                className="admin-modal-danger"
                onClick={eliminarPublicacion}
              >
                Eliminar
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default AdminPublicaciones;