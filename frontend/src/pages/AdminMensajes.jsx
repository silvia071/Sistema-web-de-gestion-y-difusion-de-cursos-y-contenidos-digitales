import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminMensajes.css";

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearHora(fecha) {
  if (!fecha) return "";

  return new Date(fecha).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizarEstado(estado) {
  return String(estado || "NO_LEIDO").toUpperCase();
}

function obtenerInicial(nombre) {
  return String(nombre || "U")
    .trim()
    .charAt(0)
    .toUpperCase();
}

function AdminMensajes() {
  const navigate = useNavigate();

  const [mensajes, setMensajes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [accionandoId, setAccionandoId] = useState(null);
  const [error, setError] = useState("");

  const cargarMensajes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/mensajes");
      const datos = Array.isArray(response.data) ? response.data : [];

      setMensajes(datos);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudieron cargar los mensajes.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cambiarEstado = async (id, accion) => {
    try {
      setAccionandoId(id);
      setError("");

      await api.patch(`/api/mensajes/${id}/${accion}`);
      await cargarMensajes();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudo actualizar el mensaje.",
      );
    } finally {
      setAccionandoId(null);
    }
  };

  const mensajesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return mensajes.filter((mensaje) => {
      const estado = normalizarEstado(mensaje.estado);

      const cumpleEstado = estadoFiltro === "TODOS" || estado === estadoFiltro;

      const contenidoBusqueda = `${mensaje.nombre || ""} ${
        mensaje.email || ""
      } ${mensaje.contenido || ""}`.toLowerCase();

      const cumpleBusqueda = !texto || contenidoBusqueda.includes(texto);

      return cumpleEstado && cumpleBusqueda;
    });
  }, [mensajes, estadoFiltro, busqueda]);

  const resumen = useMemo(() => {
    return mensajes.reduce(
      (acc, mensaje) => {
        const estado = normalizarEstado(mensaje.estado);

        acc.total += 1;
        if (estado === "NO_LEIDO") acc.noLeidos += 1;
        if (estado === "LEIDO") acc.leidos += 1;
        if (estado === "RESPONDIDO") acc.respondidos += 1;

        return acc;
      },
      {
        total: 0,
        noLeidos: 0,
        leidos: 0,
        respondidos: 0,
      },
    );
  }, [mensajes]);

  return (
    <section className="admin-mensajes-page">
      <div className="admin-mensajes-layout">
        <aside className="admin-mensajes-sidebar">
          <div>
            <span className="admin-sidebar-label">Panel admin</span>

            <nav className="admin-mensajes-nav">
              <button type="button" onClick={() => navigate("/admin")}>
                <span>⌂</span>
                Dashboard
              </button>

              <button type="button" onClick={() => navigate("/admin/cursos")}>
                <span>▣</span>
                Cursos
              </button>

              <button type="button" className="active">
                <span>✉</span>
                Mensajes
              </button>

              <button type="button" onClick={() => navigate("/admin/usuarios")}>
                <span>👥</span>
                Usuarios
              </button>

              <button type="button" onClick={() => navigate("/admin/pagos")}>
                <span>💳</span>
                Pagos
              </button>

              <button type="button" onClick={() => navigate("/admin/compras")}>
                <span>🛒</span>
                Compras
              </button>
            </nav>
          </div>

          <div className="admin-mensajes-help">
            <strong>¿Necesitás ayuda?</strong>
            <p>
              Los mensajes pueden marcarse como leídos, respondidos o
              eliminados.
            </p>
          </div>
        </aside>

        <main className="admin-mensajes-panel">
          <header className="admin-mensajes-header">
            <div>
              <div className="admin-mensajes-breadcrumb">
                Dashboard <span>›</span> Mensajes
              </div>

              <h1>Mensajes recibidos</h1>

              <p>
                Consultá, filtrá y administrá los mensajes enviados desde el
                formulario de contacto.
              </p>
            </div>

            <div className="admin-mensajes-header-actions">
              <button
                type="button"
                className="admin-mensajes-secondary"
                onClick={() => navigate("/admin")}
              >
                ← Volver al panel
              </button>

              <button
                type="button"
                className="admin-mensajes-primary"
                onClick={cargarMensajes}
                disabled={loading}
              >
                {loading ? "Actualizando..." : "↻ Actualizar"}
              </button>
            </div>
          </header>

          <div className="admin-mensajes-stats">
            <article>
              <div className="stat-icon violet">✉</div>
              <div>
                <span>Total</span>
                <strong>{resumen.total}</strong>
                <small>Mensajes</small>
              </div>
            </article>

            <article>
              <div className="stat-icon yellow">●</div>
              <div>
                <span>No leídos</span>
                <strong>{resumen.noLeidos}</strong>
                <small>Pendientes</small>
              </div>
            </article>

            <article>
              <div className="stat-icon blue">◉</div>
              <div>
                <span>Leídos</span>
                <strong>{resumen.leidos}</strong>
                <small>Revisados</small>
              </div>
            </article>

            <article>
              <div className="stat-icon green">✓</div>
              <div>
                <span>Respondidos</span>
                <strong>{resumen.respondidos}</strong>
                <small>Cerrados</small>
              </div>
            </article>
          </div>

          <div className="admin-mensajes-toolbar">
            <div className="admin-mensajes-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Buscar por nombre, email o contenido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="admin-mensajes-filter">
              <label>Estado</label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                <option value="TODOS">Todos</option>
                <option value="NO_LEIDO">No leídos</option>
                <option value="LEIDO">Leídos</option>
                <option value="RESPONDIDO">Respondidos</option>
                <option value="ELIMINADO">Eliminados</option>
              </select>
            </div>

            <button
              type="button"
              className="admin-mensajes-clear"
              onClick={() => {
                setBusqueda("");
                setEstadoFiltro("TODOS");
              }}
            >
              Limpiar filtros
            </button>
          </div>

          {error && <p className="admin-mensajes-error">{error}</p>}

          <section className="admin-mensajes-table">
            <div className="admin-mensajes-table-head">
              <span>Remitente</span>
              <span>Mensaje</span>
              <span>Estado</span>
              <span>Fecha</span>
              <span>Acciones</span>
            </div>

            {loading ? (
              <div className="admin-mensajes-empty">Cargando mensajes...</div>
            ) : mensajesFiltrados.length === 0 ? (
              <div className="admin-mensajes-empty">
                No hay mensajes para mostrar.
              </div>
            ) : (
              <div className="admin-mensajes-table-body">
                {mensajesFiltrados.map((mensaje) => {
                  const id = mensaje._id || mensaje.id;
                  const estado = normalizarEstado(mensaje.estado);
                  const accionando = accionandoId === id;

                  return (
                    <article className="admin-mensaje-row" key={id}>
                      <div className="admin-mensaje-user">
                        <div className="admin-mensaje-avatar">
                          {obtenerInicial(mensaje.nombre)}
                        </div>

                        <div>
                          <strong>{mensaje.nombre || "Sin nombre"}</strong>
                          <span>{mensaje.email || "Sin email"}</span>
                        </div>
                      </div>

                      <div className="admin-mensaje-preview">
                        <strong>Consulta recibida desde contacto</strong>

                        <p>{mensaje.contenido || "Sin contenido"}</p>
                      </div>

                      <div>
                        <span className={`admin-mensaje-estado ${estado}`}>
                          {estado.replace("_", " ")}
                        </span>
                      </div>

                      <div className="admin-mensaje-date">
                        <span>{formatearFecha(mensaje.fechaEnvio)}</span>
                        <small>{formatearHora(mensaje.fechaEnvio)}</small>
                      </div>

                      <div className="admin-mensaje-actions">
                        {estado !== "LEIDO" &&
                          estado !== "RESPONDIDO" &&
                          estado !== "ELIMINADO" && (
                            <button
                              type="button"
                              onClick={() => cambiarEstado(id, "leido")}
                              disabled={accionando}
                            >
                              Leído
                            </button>
                          )}

                        {estado !== "RESPONDIDO" && estado !== "ELIMINADO" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(id, "respondido")}
                            disabled={accionando}
                          >
                            Respondido
                          </button>
                        )}

                        {estado !== "ELIMINADO" && (
                          <button
                            type="button"
                            className="danger"
                            onClick={() => cambiarEstado(id, "eliminar")}
                            disabled={accionando}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </section>
  );
}

export default AdminMensajes;
