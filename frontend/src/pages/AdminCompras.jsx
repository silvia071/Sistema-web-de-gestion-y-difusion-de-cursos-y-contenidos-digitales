import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./AdminCompras.css";

function formatearPrecio(valor) {
  const numero = Number(valor || 0);

  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obtenerDetalles(compra) {
  return Array.isArray(compra?.detalles) ? compra.detalles : [];
}

function normalizarEstado(estado) {
  return String(estado || "PENDIENTE").toUpperCase();
}

function claseEstado(estado) {
  const estadoNormalizado = normalizarEstado(estado);

  if (
    estadoNormalizado === "PAGADA" ||
    estadoNormalizado === "APROBADA" ||
    estadoNormalizado === "COMPLETADA"
  ) {
    return "aprobada";
  }

  if (estadoNormalizado === "PENDIENTE" || estadoNormalizado === "EN_PROCESO") {
    return "pendiente";
  }

  if (estadoNormalizado === "CANCELADA" || estadoNormalizado === "RECHAZADA") {
    return "rechazada";
  }

  return "";
}

function obtenerNombreUsuario(usuario) {
  if (!usuario) return "Usuario no disponible";

  const nombreCompleto =
    `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim();

  return nombreCompleto || usuario.email || "Usuario sin nombre";
}

export default function AdminCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [orden, setOrden] = useState("recientes");
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const obtenerCompras = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/compra/admin/todas");

      const comprasData = Array.isArray(response.data?.datos)
        ? response.data.datos
        : Array.isArray(response.data)
          ? response.data
          : [];

      setCompras(comprasData);
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          error.message ||
          "No se pudieron cargar las órdenes de compra.",
      );
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  const resumen = useMemo(() => {
    const totalFacturado = compras.reduce(
      (total, compra) => total + Number(compra.total || 0),
      0,
    );

    const pendientes = compras.filter((compra) => {
      const estado = normalizarEstado(compra.estado);
      return estado === "PENDIENTE" || estado === "EN_PROCESO";
    }).length;

    const cursosVendidos = compras.reduce(
      (total, compra) => total + obtenerDetalles(compra).length,
      0,
    );

    const usuariosUnicos = new Set(
      compras
        .map((compra) => compra?.usuario?._id || compra?.usuario?.id)
        .filter(Boolean),
    ).size;

    return {
      totalFacturado,
      pendientes,
      cursosVendidos,
      usuariosUnicos,
    };
  }, [compras]);

  const comprasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    let resultado = compras.filter((compra) => {
      const estado = normalizarEstado(compra.estado);
      const estadoTexto = estado.toLowerCase();

      const usuario = compra?.usuario || {};
      const datosUsuario =
        `${usuario.nombre || ""} ${usuario.apellido || ""} ${usuario.email || ""}`.toLowerCase();

      const cursos = obtenerDetalles(compra)
        .map((detalle) => detalle?.curso?.titulo || "")
        .join(" ")
        .toLowerCase();

      const idCompra = String(compra?._id || compra?.id || "").toLowerCase();

      const coincideTexto =
        !texto ||
        estadoTexto.includes(texto) ||
        datosUsuario.includes(texto) ||
        cursos.includes(texto) ||
        idCompra.includes(texto);

      const coincideEstado =
        estadoFiltro === "todos" || estadoTexto === estadoFiltro.toLowerCase();

      return coincideTexto && coincideEstado;
    });

    if (orden === "recientes") {
      resultado = [...resultado].sort(
        (a, b) =>
          new Date(b.createdAt || b.fechaCompra || 0) -
          new Date(a.createdAt || a.fechaCompra || 0),
      );
    }

    if (orden === "antiguas") {
      resultado = [...resultado].sort(
        (a, b) =>
          new Date(a.createdAt || a.fechaCompra || 0) -
          new Date(b.createdAt || b.fechaCompra || 0),
      );
    }

    if (orden === "mayor-total") {
      resultado = [...resultado].sort(
        (a, b) => Number(b.total || 0) - Number(a.total || 0),
      );
    }

    return resultado;
  }, [compras, busqueda, estadoFiltro, orden]);

  if (loading) {
    return (
      <main className="admin-compras-page">
        <section className="admin-compras-header">
          <div>
            <span>Panel administrador</span>
            <h1>Órdenes de compra</h1>
            <p>Cargando órdenes registradas...</p>
          </div>
        </section>

        <section className="admin-compras-table-card">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="admin-compras-skeleton"></div>
          ))}
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-compras-page">
        <section className="admin-compras-header">
          <div>
            <span>Panel administrador</span>
            <h1>Órdenes de compra</h1>
            <p>Hubo un problema al cargar las órdenes.</p>
          </div>
        </section>

        <div className="admin-compras-empty">
          <h3>No se pudieron cargar las compras</h3>
          <p>{error}</p>
          <button type="button" onClick={obtenerCompras}>
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-compras-page">
      <section className="admin-compras-header">
        <div className="admin-compras-header-text">
          <div className="admin-compras-breadcrumb">
            Dashboard <span>›</span> Compras
          </div>

          <h1>Órdenes de compra</h1>

          <p>
            Visualizá las compras registradas en el sistema, sus usuarios,
            estado y cursos incluidos.
          </p>
        </div>

        <div className="admin-compras-header-actions">
          <button
            type="button"
            className="btn-volver-admin"
            onClick={() => window.history.back()}
          >
            ← Volver al panel
          </button>

          <button
            type="button"
            className="btn-recargar-admin"
            onClick={obtenerCompras}
          >
            ↻ Recargar
          </button>
        </div>
      </section>

      <section className="admin-compras-stats">
        <article>
          <span className="admin-stat-icon purple">🧾</span>
          <div>
            <strong>{compras.length}</strong>
            <p>Órdenes totales</p>
          </div>
        </article>

        <article>
          <span className="admin-stat-icon blue">💳</span>
          <div>
            <strong>{formatearPrecio(resumen.totalFacturado)}</strong>
            <p>Total registrado</p>
          </div>
        </article>

        <article>
          <span className="admin-stat-icon orange">◔</span>
          <div>
            <strong>{resumen.pendientes}</strong>
            <p>Pendientes</p>
          </div>
        </article>

        <article>
          <span className="admin-stat-icon green">🎓</span>
          <div>
            <strong>{resumen.cursosVendidos}</strong>
            <p>Cursos vendidos</p>
          </div>
        </article>
      </section>

      <section className="admin-compras-toolbar">
        <div className="admin-compras-search">
          <span>⌕</span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por usuario, email, curso, estado o ID..."
          />
        </div>

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="todos">Estado: Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="pagada">Pagadas</option>
          <option value="rechazada">Rechazadas</option>
          <option value="cancelada">Canceladas</option>
        </select>

        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="antiguas">Más antiguas</option>
          <option value="mayor-total">Mayor total</option>
        </select>
      </section>

      <section className="admin-compras-table-card">
        {comprasFiltradas.length === 0 ? (
          <div className="admin-compras-empty compact">
            <h3>No encontramos órdenes</h3>
            <p>Probá cambiando la búsqueda o los filtros.</p>
          </div>
        ) : (
          <div className="admin-compras-table">
            {comprasFiltradas.map((compra) => {
              const usuario = compra.usuario;
              const detalles = obtenerDetalles(compra);
              const primerDetalle = detalles[0];
              const cursosExtra = Math.max(detalles.length - 1, 0);
              const estado = normalizarEstado(compra.estado);
              const estadoClase = claseEstado(estado);

              return (
                <article
                  key={compra._id || compra.id}
                  className="admin-compra-row"
                >
                  <div className="admin-compra-col orden">
                    <small>Orden</small>
                    <strong>
                      #{String(compra._id || compra.id).slice(-6)}
                    </strong>
                    <span className={`admin-compra-estado ${estadoClase}`}>
                      {estado}
                    </span>
                  </div>

                  <div className="admin-compra-col usuario">
                    <small>Usuario</small>
                    <strong>{obtenerNombreUsuario(usuario)}</strong>
                    <p>{usuario?.email || "Sin email"}</p>
                  </div>

                  <div className="admin-compra-col curso">
                    <small>Cursos ({detalles.length})</small>

                    {primerDetalle ? (
                      <>
                        <strong>
                          {primerDetalle?.curso?.titulo || "Curso sin título"}
                        </strong>
                        <p>
                          {primerDetalle?.curso?.categoria?.nombre ||
                            "Curso online"}
                        </p>
                        {cursosExtra > 0 && <em>+ {cursosExtra} curso más</em>}
                      </>
                    ) : (
                      <p>Sin cursos asociados</p>
                    )}
                  </div>

                  <div className="admin-compra-col fecha">
                    <small>Fecha</small>
                    <strong>
                      {formatearFecha(compra.createdAt || compra.fechaCompra)}
                    </strong>
                    <p>Mercado Pago</p>
                  </div>

                  <div className="admin-compra-col total">
                    <small>Total</small>
                    <strong>{formatearPrecio(compra.total)}</strong>
                    <button
                      type="button"
                      onClick={() => setCompraSeleccionada(compra)}
                    >
                      Ver detalle →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {compraSeleccionada && (
        <div
          className="admin-compra-modal-overlay"
          onClick={() => setCompraSeleccionada(null)}
        >
          <div
            className="admin-compra-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-compra-modal-header">
              <div>
                <span>Detalle administrativo</span>
                <h2>
                  Orden #
                  {String(
                    compraSeleccionada._id || compraSeleccionada.id,
                  ).slice(-6)}
                </h2>
              </div>

              <button type="button" onClick={() => setCompraSeleccionada(null)}>
                ×
              </button>
            </div>

            <div className="admin-compra-modal-grid">
              <div>
                <small>Estado</small>
                <strong>{normalizarEstado(compraSeleccionada.estado)}</strong>
              </div>

              <div>
                <small>Fecha</small>
                <strong>
                  {formatearFecha(
                    compraSeleccionada.createdAt ||
                      compraSeleccionada.fechaCompra,
                  )}
                </strong>
              </div>

              <div>
                <small>Total</small>
                <strong>{formatearPrecio(compraSeleccionada.total)}</strong>
              </div>

              <div>
                <small>Usuario</small>
                <strong>
                  {obtenerNombreUsuario(compraSeleccionada.usuario)}
                </strong>
              </div>

              <div>
                <small>Email</small>
                <strong>
                  {compraSeleccionada.usuario?.email || "Sin email"}
                </strong>
              </div>

              <div>
                <small>ID completo</small>
                <strong>
                  {compraSeleccionada._id || compraSeleccionada.id}
                </strong>
              </div>
            </div>

            <div className="admin-compra-modal-cursos">
              <h3>Cursos incluidos</h3>

              {obtenerDetalles(compraSeleccionada).map((detalle) => (
                <div
                  key={detalle._id || detalle.id}
                  className="admin-compra-modal-curso"
                >
                  <span>📘</span>

                  <div>
                    <strong>
                      {detalle?.curso?.titulo || "Curso sin título"}
                    </strong>
                    <p>
                      {detalle?.curso?.descripcion ||
                        detalle?.curso?.categoria?.nombre ||
                        "Curso online"}
                    </p>
                    <small>
                      {formatearPrecio(
                        detalle?.precioUnitario || detalle?.subtotal,
                      )}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
