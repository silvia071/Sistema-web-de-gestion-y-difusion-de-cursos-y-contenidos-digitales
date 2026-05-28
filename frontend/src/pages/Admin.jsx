import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Admin.css";

function formatearNumero(valor) {
  const numero = Number(valor || 0);

  return numero.toLocaleString("es-AR", {
    maximumFractionDigits: 0,
  });
}

function formatearPrecio(valor) {
  const numero = Number(valor || 0);

  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin actualizar";

  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Admin() {
  const navigate = useNavigate();

  const [periodo, setPeriodo] = useState("30dias");
  const [busqueda, setBusqueda] = useState("");
  const [loadingResumen, setLoadingResumen] = useState(true);

  const [resumen, setResumen] = useState({
    totalCursos: 0,
    totalUsuarios: 0,
    pagosPendientes: 0,
    leccionesPublicadas: 0,
    totalCompras: 0,
    totalVendido: 0,
    cursosVendidos: 0,
    accesosActivos: 0,
    actividadReciente: [],
    ultimaActualizacion: null,
  });

  const adminCards = [
    {
      titulo: "Cursos",
      descripcion: "Crear, editar y administrar cursos",
      icono: "🎓",
      ruta: "/admin/cursos",
      color: "violet",
      keywords: "curso cursos administrar crear editar",
    },
    {
      titulo: "Lecciones",
      descripcion: "Gestionar contenido y clases",
      icono: "🎥",
      ruta: "/admin/lecciones",
      color: "blue",
      keywords: "leccion lecciones clases contenido",
    },
    {
      titulo: "Cupones",
      descripcion: "Crear y administrar descuentos",
      icono: "🏷️",
      ruta: "/admin/cupones",
      color: "green",
      keywords: "cupon cupones descuento descuentos promocion codigo",
    },
    {
      titulo: "Mensajes",
      descripcion: "Consultar mensajes de contacto",
      icono: "💬",
      ruta: "/admin/mensajes",
      color: "cyan",
      keywords: "mensajes contacto consultas no leido leido respondido",
    },
    {
      titulo: "Blog",
      descripcion: "Publicaciones y noticias",
      icono: "📝",
      ruta: "/admin/publicaciones",
      color: "pink",
      keywords: "blog publicaciones noticias articulos",
    },
    {
      titulo: "Usuarios",
      descripcion: "Gestión de usuarios y roles",
      icono: "👥",
      ruta: "/admin/usuarios",
      color: "cyan",
      keywords: "usuarios clientes administradores roles",
    },
    {
      titulo: "Pagos",
      descripcion: "Aprobar o rechazar pagos",
      icono: "💳",
      ruta: "/admin/pagos",
      color: "orange",
      keywords: "pagos pago aprobar rechazar pendiente",
    },
    {
      titulo: "Compras",
      descripcion: "Consultar órdenes de compra",
      icono: "🛒",
      ruta: "/admin/compras",
      color: "blue",
      keywords: "compras ordenes ventas carrito",
    },
    {
      titulo: "Facturación",
      descripcion: "Consultar datos fiscales",
      icono: "🧾",
      ruta: "/admin/datos-facturacion",
      color: "green",
      keywords: "facturacion fiscal datos fiscales",
    },
  ];

  const cargarResumen = async (periodoSeleccionado = periodo) => {
    try {
      setLoadingResumen(true);

      const response = await api.get(
        `/api/admin/resumen?periodo=${periodoSeleccionado}`,
      );

      const datos = response.data?.datos || response.data || {};

      setResumen({
        totalCursos: datos.totalCursos || 0,
        totalUsuarios: datos.totalUsuarios || 0,
        pagosPendientes: datos.pagosPendientes || 0,
        leccionesPublicadas: datos.leccionesPublicadas || 0,
        totalCompras: datos.totalCompras || 0,
        totalVendido: datos.totalVendido || 0,
        cursosVendidos: datos.cursosVendidos || 0,
        accesosActivos: datos.accesosActivos || 0,
        actividadReciente: Array.isArray(datos.actividadReciente)
          ? datos.actividadReciente
          : [],
        ultimaActualizacion: datos.ultimaActualizacion || new Date(),
      });
    } catch (error) {
      console.warn(
        "No se pudo cargar el resumen del panel administrador:",
        error.response?.data?.mensaje || error.message,
      );
    } finally {
      setLoadingResumen(false);
    }
  };

  useEffect(() => {
    cargarResumen(periodo);
  }, [periodo]);

  const stats = useMemo(
    () => [
      {
        label: "Cursos activos",
        value: loadingResumen ? "..." : formatearNumero(resumen.totalCursos),
        icono: "🎓",
        change: "Cursos publicados",
        color: "violet",
      },
      {
        label: "Usuarios registrados",
        value: loadingResumen ? "..." : formatearNumero(resumen.totalUsuarios),
        icono: "👥",
        change: "Usuarios del período",
        color: "blue",
      },
      {
        label: "Pagos pendientes",
        value: loadingResumen
          ? "..."
          : formatearNumero(resumen.pagosPendientes),
        icono: "💳",
        change: "Requieren revisión",
        color: "orange",
      },
      {
        label: "Lecciones publicadas",
        value: loadingResumen
          ? "..."
          : formatearNumero(resumen.leccionesPublicadas),
        icono: "📘",
        change: "Contenido disponible",
        color: "cyan",
      },
    ],
    [loadingResumen, resumen],
  );

  const extraStats = useMemo(
    () => [
      {
        label: "Compras realizadas",
        value: loadingResumen ? "..." : formatearNumero(resumen.totalCompras),
        ruta: "/admin/compras",
      },
      {
        label: "Total vendido",
        value: loadingResumen ? "..." : formatearPrecio(resumen.totalVendido),
        ruta: "/admin/compras?estado=APROBADA",
      },
      {
        label: "Cursos vendidos",
        value: loadingResumen ? "..." : formatearNumero(resumen.cursosVendidos),
        ruta: "/admin/compras?estado=APROBADA",
      },
      {
        label: "Accesos activos",
        value: loadingResumen ? "..." : formatearNumero(resumen.accesosActivos),
        ruta: "/admin/usuarios",
      },
    ],
    [loadingResumen, resumen],
  );

  const cardsFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return adminCards;

    return adminCards.filter((card) => {
      const contenido = `${card.titulo} ${card.descripcion} ${card.keywords}`;
      return contenido.toLowerCase().includes(texto);
    });
  }, [busqueda]);

  const alertas = useMemo(
    () => [
      {
        label: "Pagos pendientes",
        value: formatearNumero(resumen.pagosPendientes),
        descripcion:
          resumen.pagosPendientes > 0
            ? "Requieren revisión administrativa"
            : "No hay pagos pendientes",
        color: resumen.pagosPendientes > 0 ? "orange" : "green",
        ruta: "/admin/pagos?estado=PENDIENTE",
      },
      {
        label: "Compras registradas",
        value: formatearNumero(resumen.totalCompras),
        descripcion: "Órdenes dentro del período seleccionado",
        color: "blue",
        ruta: "/admin/compras",
      },
      {
        label: "Accesos activos",
        value: formatearNumero(resumen.accesosActivos),
        descripcion: "Usuarios con cursos habilitados",
        color: "cyan",
        ruta: "/admin/usuarios",
      },
      {
        label: "Total vendido",
        value: formatearPrecio(resumen.totalVendido),
        descripcion: "Ventas aprobadas del período",
        color: "green",
        ruta: "/admin/compras?estado=APROBADA",
      },
    ],
    [resumen],
  );

  const cambiarPeriodo = (nuevoPeriodo) => {
    setPeriodo(nuevoPeriodo);
  };

  const handleNavigate = (card) => {
    if (card.proximamente) return;
    if (card.ruta) navigate(card.ruta);
  };

  const navegarPrimerModulo = (e) => {
    if (e.key !== "Enter") return;

    const primerModuloDisponible = cardsFiltradas.find(
      (card) => !card.proximamente && card.ruta,
    );

    if (primerModuloDisponible) {
      navigate(primerModuloDisponible.ruta);
    }
  };

  const navegarDesdeAlerta = (ruta) => {
    if (ruta) navigate(ruta);
  };

  const obtenerRutaActividad = (tipo) => {
    const rutas = {
      usuario: "/admin/usuarios",
      compra: "/admin/compras",
      pago: "/admin/pagos",
      curso: "/admin/cursos",
      leccion: "/admin/lecciones",
    };

    return rutas[tipo] || "/admin";
  };

  const navegarDesdeActividad = (actividad) => {
    const ruta = obtenerRutaActividad(actividad.tipo);
    navigate(ruta);
  };

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-logo">MD</div>
          <div>
            <strong>MD Estudio</strong>
            <span>Panel admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button className="active">🏠 Inicio</button>

          <button onClick={() => navigate("/admin/cursos")}>🎓 Cursos</button>

          <button onClick={() => navigate("/admin/lecciones")}>
            🎥 Lecciones
          </button>

          <button onClick={() => navigate("/admin/cupones")}>🏷️ Cupones</button>

          <button onClick={() => navigate("/admin/mensajes")}>
            💬 Mensajes
          </button>

          <button onClick={() => navigate("/admin/publicaciones")}>
            📝 Blog
          </button>

          <button onClick={() => navigate("/admin/usuarios")}>
            👥 Usuarios
          </button>

          <button onClick={() => navigate("/admin/pagos")}>💳 Pagos</button>

          <button onClick={() => navigate("/admin/compras")}>🛒 Compras</button>

          <button onClick={() => navigate("/admin/datos-facturacion")}>
            🧾 Facturación
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>Plataforma educativa</span>
          <strong>Versión 1.0</strong>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-search">
            <span>🔎</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={navegarPrimerModulo}
              placeholder="Buscar módulo del sistema..."
            />
          </div>

          <div className="admin-user-pill">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrador</strong>
              <span>admin@mdestudio.com</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-hero">
            <div>
              <span className="admin-eyebrow">Panel de control</span>

              <h1>Panel de administración</h1>

              <p>
                Gestioná cursos, usuarios, pagos, compras, lecciones, cupones,
                mensajes y contenido desde un solo lugar.
              </p>

              <small className="admin-last-update">
                Última actualización:{" "}
                {formatearFecha(resumen.ultimaActualizacion)}
              </small>
            </div>

            <div className="admin-hero-actions">
              <div className="admin-date-filter">
                <button
                  className={periodo === "hoy" ? "active" : ""}
                  onClick={() => cambiarPeriodo("hoy")}
                  type="button"
                >
                  Hoy
                </button>

                <button
                  className={periodo === "7dias" ? "active" : ""}
                  onClick={() => cambiarPeriodo("7dias")}
                  type="button"
                >
                  7 días
                </button>

                <button
                  className={periodo === "30dias" ? "active" : ""}
                  onClick={() => cambiarPeriodo("30dias")}
                  type="button"
                >
                  30 días
                </button>

                <button
                  className={periodo === "mes" ? "active" : ""}
                  onClick={() => cambiarPeriodo("mes")}
                  type="button"
                >
                  Este mes
                </button>

                <button
                  type="button"
                  className="admin-refresh-btn"
                  onClick={() => cargarResumen(periodo)}
                  disabled={loadingResumen}
                >
                  {loadingResumen ? "Actualizando..." : "↻ Actualizar"}
                </button>
              </div>
            </div>
          </div>

          <div className="admin-stats-grid">
            {stats.map((stat) => (
              <article className="admin-stat-card" key={stat.label}>
                <div className={`admin-stat-icon ${stat.color}`}>
                  {stat.icono}
                </div>

                <div>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.change}</small>
                </div>
              </article>
            ))}
          </div>

          <section className="admin-alert-panel">
            {alertas.map((alerta) => (
              <button
                type="button"
                className={`admin-alert-card ${alerta.color}`}
                key={alerta.label}
                onClick={() => navegarDesdeAlerta(alerta.ruta)}
                title={`Ir a ${alerta.label.toLowerCase()}`}
              >
                <small>{alerta.label}</small>
                <strong>{alerta.value}</strong>
                <p>{alerta.descripcion}</p>
                <span className="admin-alert-arrow">→</span>
              </button>
            ))}
          </section>

          <div className="admin-dashboard-grid">
            <section className="admin-module-panel">
              <div className="admin-section-title">
                <div>
                  <h2>Gestión del sistema</h2>
                  <p>Accesos rápidos a los módulos principales</p>
                </div>
              </div>

              <div className="admin-grid">
                {cardsFiltradas.length === 0 ? (
                  <div className="admin-empty-modules">
                    No se encontraron módulos para esa búsqueda.
                  </div>
                ) : (
                  cardsFiltradas.map((card) => (
                    <button
                      className={`admin-card ${card.color} ${
                        card.proximamente ? "disabled-card" : ""
                      }`}
                      key={card.titulo}
                      onClick={() => handleNavigate(card)}
                      type="button"
                    >
                      <div className="admin-card-icon">{card.icono}</div>

                      <div>
                        <h3>
                          {card.titulo}

                          {card.proximamente && (
                            <span className="admin-badge-proximamente">
                              Próximamente
                            </span>
                          )}
                        </h3>

                        <p>{card.descripcion}</p>
                      </div>

                      <span className="admin-card-arrow">
                        {card.proximamente ? "⏳" : "→"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </section>

            <aside className="admin-summary-panel">
              <div className="admin-section-title">
                <div>
                  <h2>Resumen comercial</h2>
                  <p>Indicadores generales de la plataforma</p>
                </div>
              </div>

              <ul className="admin-activity-list">
                {extraStats.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="admin-summary-link"
                      onClick={() => item.ruta && navigate(item.ruta)}
                    >
                      <span className="dot blue"></span>

                      <div>
                        <strong>{item.label}</strong>
                        <p>{item.value}</p>
                      </div>

                      <span className="admin-summary-arrow">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <section className="admin-recent-panel">
            <div className="admin-section-title">
              <div>
                <h2>Actividad reciente</h2>
                <p>Últimos movimientos reales registrados en la plataforma</p>
              </div>
            </div>

            {resumen.actividadReciente.length === 0 ? (
              <div className="admin-empty-modules">
                Todavía no hay actividad reciente para mostrar.
              </div>
            ) : (
              <ul className="admin-activity-list recent">
                {resumen.actividadReciente.map((actividad, index) => (
                  <li key={`${actividad.tipo}-${index}`}>
                    <button
                      type="button"
                      className="admin-recent-item"
                      onClick={() => navegarDesdeActividad(actividad)}
                      title={`Ir a ${actividad.titulo.toLowerCase()}`}
                    >
                      <span
                        className={`dot ${actividad.color || "blue"}`}
                      ></span>

                      <div>
                        <strong>{actividad.titulo}</strong>
                        <p>{actividad.descripcion}</p>
                        <small>{actividad.tiempo}</small>
                      </div>

                      <span className="admin-recent-arrow">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </section>
  );
}

export default Admin;
