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
  const [modalPublicacionAbierto, setModalPublicacionAbierto] = useState(false);

  const inputTituloRef = useRef(null);
  const navigate = useNavigate();

  const limpiarForm = () => {
    setForm(ESTADO_INICIAL_FORM);
    setEditandoId(null);
    setError("");
  };

  const abrirModalCrearPublicacion = () => {
    limpiarForm();
    setMensaje("");
    setModalPublicacionAbierto(true);

    setTimeout(() => {
      inputTituloRef.current?.focus();
    }, 100);
  };

  const cerrarModalPublicacion = () => {
    limpiarForm();
    setModalPublicacionAbierto(false);
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

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

    const titulo = form.titulo.trim();
    const resumen = form.resumen.trim();
    const contenido = form.contenido.trim();
    const imagen = form.imagen.trim();
    const autor = form.autor.trim();

    if (!titulo) {
      errores.push("El título es obligatorio.");
    } else if (titulo.length < 5) {
      errores.push("El título debe tener al menos 5 caracteres.");
    } else if (titulo.length > 100) {
      errores.push("El título no puede superar los 100 caracteres.");
    }

    if (resumen.length > 0 && resumen.length < 20) {
      errores.push("El resumen debe tener al menos 20 caracteres.");
    } else if (resumen.length > 300) {
      errores.push("El resumen no puede superar los 300 caracteres.");
    }

    if (!contenido) {
      errores.push("El contenido es obligatorio.");
    } else if (contenido.length < 50) {
      errores.push("El contenido debe tener al menos 50 caracteres.");
    } else if (contenido.length > 5000) {
      errores.push("El contenido no puede superar los 5000 caracteres.");
    }

    if (imagen.length > 300) {
      errores.push("La URL de la imagen no puede superar los 300 caracteres.");
    }

    if (autor.length > 0 && autor.length < 3) {
      errores.push("El autor debe tener al menos 3 caracteres.");
    } else if (autor.length > 80) {
      errores.push("El autor no puede superar los 80 caracteres.");
    }

    if (!form.categoria) {
      errores.push("La categoría es obligatoria.");
    }

    if (!form.estado) {
      errores.push("El estado es obligatorio.");
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
        await api.put(`/api/publicaciones/${editandoId}`, payload);
        setMensaje("Publicación actualizada correctamente.");
      } else {
        await api.post("/api/publicaciones", payload);
        setMensaje("Publicación creada correctamente.");
      }

      limpiarForm();
      setModalPublicacionAbierto(false);
      await cargarDatos();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.mensaje ||
          err.response?.data?.errores?.join(" ") ||
          "Error al guardar publicación.",
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

    setMensaje("");
    setError("");
    setModalPublicacionAbierto(true);

    setTimeout(() => {
      inputTituloRef.current?.focus();
    }, 100);
  };

  const eliminarPublicacion = async () => {
    if (!modalEliminar) return;

    try {
      await api.delete(`/api/publicaciones/${modalEliminar._id}`);

      setMensaje("Publicación eliminada correctamente.");
      setModalEliminar(null);

      if (editandoId === modalEliminar._id) {
        limpiarForm();
        setModalPublicacionAbierto(false);
      }

      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar publicación.");
    }
  };

  const publicacionesFiltradas = useMemo(() => {
    return publicaciones.filter((pub) => {
      const textoBusqueda = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !textoBusqueda ||
        pub.titulo?.toLowerCase().includes(textoBusqueda) ||
        pub.resumen?.toLowerCase().includes(textoBusqueda) ||
        pub.contenido?.toLowerCase().includes(textoBusqueda);

      const coincideEstado = !filtroEstado || pub.estado === filtroEstado;

      const categoriaId =
        typeof pub.categoria === "object" ? pub.categoria?._id : pub.categoria;

      const coincideCategoria =
        !filtroCategoria || categoriaId === filtroCategoria;

      return coincideBusqueda && coincideEstado && coincideCategoria;
    });
  }, [publicaciones, busqueda, filtroEstado, filtroCategoria]);

  const totalPublicadas = publicaciones.filter(
    (p) => p.estado === "PUBLICADO",
  ).length;

  const totalBorrador = publicaciones.filter(
    (p) => p.estado === "BORRADOR",
  ).length;

  const totalOcultas = publicaciones.filter(
    (p) => p.estado === "OCULTO",
  ).length;

  if (loading) {
    return (
      <section className="admin-cursos-page">
        <div className="admin-cursos-shell admin-loading-card">
          <div className="admin-loading-icon">📰</div>
          <h1>Gestión de publicaciones</h1>
          <p>Cargando publicaciones...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-cursos-page">
      <div className="admin-cursos-shell">
        <header className="admin-cursos-header">
          <div>
            <h1>Gestión de publicaciones</h1>

            <p>Administrá artículos y novedades del blog.</p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-back-btn"
              onClick={() => navigate("/admin")}
            >
              ← Volver
            </button>

            <button
              type="button"
              className="admin-primary-btn"
              onClick={abrirModalCrearPublicacion}
            >
              <span>+</span>
              Nueva publicación
            </button>
          </div>
        </header>

        {(mensaje || (error && !modalPublicacionAbierto)) && (
          <div className="admin-feedback-zone">
            {mensaje && <div className="admin-alert success">{mensaje}</div>}

            {error && !modalPublicacionAbierto && (
              <div className="admin-alert error">{error}</div>
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
              onChange={(e) => setFiltroEstado(e.target.value)}
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
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas</option>

              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={cargarDatos}
          >
            ↻ Recargar
          </button>
        </div>

        <div className="admin-cursos-dashboard-grid">
          <div className="admin-list-card admin-list-card-full">
            <div className="admin-list-header">
              <div>
                <h2>Publicaciones</h2>

                <p>Publicaciones cargadas.</p>
              </div>

              <span>{publicacionesFiltradas.length}</span>
            </div>

            <div className="admin-list">
              {publicacionesFiltradas.length === 0 ? (
                <div className="admin-empty-card">
                  <div className="admin-empty-icon">📰</div>
                  <h3>No se encontraron publicaciones</h3>
                  <p>
                    No hay publicaciones cargadas o no coinciden con los filtros
                    aplicados.
                  </p>

                  <div className="admin-empty-actions">
                    <button type="button" onClick={abrirModalCrearPublicacion}>
                      Crear publicación
                    </button>
                  </div>
                </div>
              ) : (
                publicacionesFiltradas.map((pub) => (
                  <article className="admin-item" key={pub._id}>
                    <div className="admin-course-main">
                      <div className="admin-course-avatar">📰</div>

                      <div>
                        <h3>{pub.titulo}</h3>

                        <p>{pub.resumen || "Sin resumen"}</p>
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

                        <strong>{pub.categoria?.nombre || "-"}</strong>
                      </div>
                    </div>

                    <div className="admin-course-actions">
                      <button
                        type="button"
                        className="admin-edit-btn"
                        onClick={() => cargarParaEditar(pub)}
                        title="Editar publicación"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() => setModalEliminar(pub)}
                        title="Eliminar publicación"
                      >
                        🗑
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {modalPublicacionAbierto && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card admin-modal-publicacion">
            <button
              type="button"
              className="admin-modal-close"
              onClick={cerrarModalPublicacion}
              disabled={guardando}
            >
              ×
            </button>

            <form
              className="admin-form-card admin-form-card-modal"
              onSubmit={guardarPublicacion}
            >
              <div className="admin-form-card-header">
                <div className="admin-form-icon">✎</div>

                <div>
                  <h2>
                    {editandoId ? "Editar publicación" : "Nueva publicación"}
                  </h2>

                  <p>
                    {editandoId
                      ? "Modificá la información del artículo seleccionado."
                      : "Completá la información para crear un nuevo artículo."}
                  </p>
                </div>
              </div>

              {error && <div className="admin-alert error">{error}</div>}

              <div className="admin-form-grid">
                <label>
                  <span>Título</span>

                  <input
                    ref={inputTituloRef}
                    name="titulo"
                    placeholder="Ej. Novedades de programación"
                    value={form.titulo}
                    onChange={handleChange}
                    minLength={5}
                    maxLength={100}
                    required
                  />

                  <small className="admin-field-help">
                    {form.titulo.length}/100 caracteres
                  </small>
                </label>

                <label>
                  <span>Resumen</span>

                  <textarea
                    name="resumen"
                    placeholder="Resumen breve de la publicación..."
                    value={form.resumen}
                    onChange={handleChange}
                    rows={3}
                    minLength={20}
                    maxLength={300}
                  />

                  <small className="admin-field-help">
                    {form.resumen.length}/300 caracteres
                  </small>
                </label>

                <label className="admin-publicacion-field-content">
                  <span>Contenido</span>

                  <textarea
                    name="contenido"
                    placeholder="Escribí el contenido completo del artículo..."
                    value={form.contenido}
                    onChange={handleChange}
                    rows={8}
                    minLength={50}
                    maxLength={5000}
                    required
                  />

                  <small className="admin-field-help">
                    {form.contenido.length}/5000 caracteres
                  </small>
                </label>

                <label>
                  <span>Imagen URL</span>

                  <input
                    name="imagen"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={form.imagen}
                    onChange={handleChange}
                    maxLength={300}
                  />

                  <small className="admin-field-help">
                    {form.imagen.length}/300 caracteres
                  </small>
                </label>

                <label>
                  <span>Autor</span>

                  <input
                    name="autor"
                    placeholder="Ej. Equipo Mundo Dev"
                    value={form.autor}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={80}
                  />

                  <small className="admin-field-help">
                    {form.autor.length}/80 caracteres
                  </small>
                </label>

                <label>
                  <span>Categoría</span>

                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar</option>

                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>
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
                    required
                  >
                    <option value="BORRADOR">Borrador</option>
                    <option value="PUBLICADO">Publicado</option>
                    <option value="OCULTO">Oculto</option>
                  </select>
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-clean-btn"
                  onClick={cerrarModalPublicacion}
                  disabled={guardando}
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
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-icon">🗑</div>

            <h2>Eliminar publicación</h2>

            <p>
              ¿Seguro que querés eliminar:{" "}
              <strong>{modalEliminar.titulo}</strong>?
            </p>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                onClick={() => setModalEliminar(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
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
