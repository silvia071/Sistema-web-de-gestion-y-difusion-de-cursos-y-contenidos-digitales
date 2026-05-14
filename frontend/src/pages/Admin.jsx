import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  const adminCards = [
    {
      titulo: "Cursos",
      descripcion: "Crear, editar y administrar cursos",
      icono: "🎓",
      ruta: "/admin/cursos",
      color: "violet",
    },
    {
      titulo: "Lecciones",
      descripcion: "Gestionar contenido y clases",
      icono: "🎥",
      ruta: "/admin/lecciones",
      color: "blue",
    },
    {
      titulo: "Blog",
      descripcion: "Publicaciones y noticias",
      icono: "📝",
      ruta: null,
      color: "pink",
    },
    {
      titulo: "Usuarios",
      descripcion: "Gestión de usuarios y roles",
      icono: "👥",
      ruta: "/admin/usuarios",
      color: "cyan",
    },
    {
      titulo: "Pagos",
      descripcion: "Aprobar o rechazar pagos",
      icono: "💳",
      ruta: "/admin/pagos",
      color: "orange",
    },
    {
      titulo: "Facturación",
      descripcion: "Consultar datos fiscales",
      icono: "🧾",
      ruta: "/admin/datos-facturacion",
      color: "green",
    },
  ];

  const stats = [
    {
      label: "Cursos activos",
      value: "32",
      icono: "🎓",
      change: "+12%",
      color: "violet",
    },
    {
      label: "Usuarios registrados",
      value: "1.245",
      icono: "👥",
      change: "+18%",
      color: "blue",
    },
    {
      label: "Pagos pendientes",
      value: "23",
      icono: "💳",
      change: "-8%",
      color: "orange",
    },
    {
      label: "Lecciones publicadas",
      value: "156",
      icono: "📘",
      change: "+15%",
      color: "cyan",
    },
  ];

  const handleNavigate = (ruta) => {
    if (ruta) navigate(ruta);
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
          <button>📝 Blog</button>
          <button onClick={() => navigate("/admin/usuarios")}>
            👥 Usuarios
          </button>
          <button onClick={() => navigate("/admin/pagos")}>💳 Pagos</button>
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
            <input type="text" placeholder="Buscar en el sistema..." />
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
                Gestioná cursos, usuarios, pagos, lecciones y contenido desde un
                solo lugar.
              </p>
            </div>

            <div className="admin-date-filter">
              <button>Hoy</button>
              <button>7 días</button>
              <button className="active">30 días</button>
              <button>Este mes</button>
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
                  <small>{stat.change} vs. mes anterior</small>
                </div>
              </article>
            ))}
          </div>

          <div className="admin-dashboard-grid">
            <section className="admin-module-panel">
              <div className="admin-section-title">
                <div>
                  <h2>Gestión del sistema</h2>
                  <p>Accesos rápidos a los módulos principales</p>
                </div>
              </div>

              <div className="admin-grid">
                {adminCards.map((card) => (
                  <button
                    className={`admin-card ${card.color}`}
                    key={card.titulo}
                    onClick={() => handleNavigate(card.ruta)}
                    type="button"
                  >
                    <div className="admin-card-icon">{card.icono}</div>
                    <div>
                      <h3>{card.titulo}</h3>
                      <p>{card.descripcion}</p>
                    </div>
                    <span className="admin-card-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="admin-summary-panel">
              <div className="admin-section-title">
                <div>
                  <h2>Actividad reciente</h2>
                  <p>Últimos movimientos de la plataforma</p>
                </div>
              </div>

              <ul className="admin-activity-list">
                <li>
                  <span className="dot violet"></span>
                  <div>
                    <strong>Nuevo usuario registrado</strong>
                    <p>Hace 5 minutos</p>
                  </div>
                </li>
                <li>
                  <span className="dot blue"></span>
                  <div>
                    <strong>Curso actualizado</strong>
                    <p>Hace 20 minutos</p>
                  </div>
                </li>
                <li>
                  <span className="dot orange"></span>
                  <div>
                    <strong>Pago pendiente de revisión</strong>
                    <p>Hace 1 hora</p>
                  </div>
                </li>
                <li>
                  <span className="dot cyan"></span>
                  <div>
                    <strong>Lección publicada</strong>
                    <p>Hace 2 horas</p>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Admin;
