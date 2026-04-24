import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  return (
    <section className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Panel administrador</h1>
          <p>Gestioná todo el sistema desde acá</p>
        </div>

        <div className="admin-grid">
          <div className="admin-card" onClick={() => navigate("/admin/cursos")}>
            <h2>📚 Cursos</h2>
            <p>Crear, editar y eliminar cursos</p>
          </div>

          <div className="admin-card">
            <h2>🎥 Lecciones</h2>
            <p>Administrar contenido de cursos</p>
          </div>

          <div className="admin-card">
            <h2>📝 Blog</h2>
            <p>Publicaciones y noticias</p>
          </div>

          <div className="admin-card">
            <h2>👥 Usuarios</h2>
            <p>Gestión de usuarios</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admin;
