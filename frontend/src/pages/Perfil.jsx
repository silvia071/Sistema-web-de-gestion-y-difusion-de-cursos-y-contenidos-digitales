<<<<<<< HEAD
//para hacer
=======
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Perfil.css";
import logo from "../assets/logo.png";

function Perfil() {
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "";
  const nombre = email ? email.split("@")[0] : "";

  const [misCursos, setMisCursos] = useState([]);

  useEffect(() => {
    const cursosGuardados = JSON.parse(localStorage.getItem("misCursos")) || [];
    setMisCursos(cursosGuardados);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <section className="perfil-page">
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            <img src={logo} alt="Logo" />
          </div>

          <div className="perfil-header-info">
            <h1 className="perfil-title">Mi perfil</h1>
            <p className="perfil-subtitle">Panel personal del usuario</p>
          </div>
        </div>

        <div className="perfil-grid">
          <div className="perfil-group">
            <label className="perfil-label">Nombre de usuario</label>
            <div className="perfil-value">{nombre || "-"}</div>
          </div>

          <div className="perfil-group">
            <label className="perfil-label">Email</label>
            <div className="perfil-value">{email || "-"}</div>
          </div>

          <div className="perfil-group">
            <label className="perfil-label">Estado</label>
            <div className="perfil-value">Sesión activa</div>
          </div>

          <div className="perfil-group">
            <label className="perfil-label">Cursos comprados</label>
            <div className="perfil-value">{misCursos.length} cursos</div>
          </div>
        </div>

        <div className="perfil-actions">
          <button className="perfil-btn perfil-btn-primary">
            Editar perfil
          </button>

          <button
            className="perfil-btn perfil-btn-secondary"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="perfil-cursos">
        <h2 className="perfil-cursos-title">Mis cursos</h2>

        <div className="perfil-cursos-list">
          {misCursos.length > 0 ? (
            misCursos.map((curso) => (
              <div key={curso.id} className="perfil-curso-card">
                <img src={curso.imagen} alt={curso.titulo} />
                <h3>{curso.titulo}</h3>
                <p>${curso.precio.toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div className="perfil-vacio">
              No tenés cursos comprados todavía.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Perfil;
>>>>>>> bfaa1e832a1a16c2df45493aec008dc75fc1582c
