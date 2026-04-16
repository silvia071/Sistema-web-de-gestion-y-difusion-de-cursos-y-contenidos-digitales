import { NavLink, useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const { cantidadTotal } = useCarrito();
  const navigate = useNavigate();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [animarBadge, setAnimarBadge] = useState(false);

  const token = localStorage.getItem("token");
  const nombre = localStorage.getItem("nombre");

  useEffect(() => {
    if (cantidadTotal > 0) {
      setAnimarBadge(true);

      const timer = setTimeout(() => {
        setAnimarBadge(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [cantidadTotal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("nombre");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar__content">
        <div className="navbar__logo">
          <NavLink to="/">
            <img src={logo} alt="Mundo Dev" className="navbar__logo-img" />
          </NavLink>
        </div>

        <nav className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/cursos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cursos
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Blog
          </NavLink>

          {token && (
            <NavLink
              to="/carrito"
              className={({ isActive }) =>
                `navbar__carrito-link ${isActive ? "active" : ""}`
              }
            >
              Carrito
              {cantidadTotal > 0 && (
                <span
                  className={`navbar__carrito-badge ${
                    animarBadge ? "navbar__carrito-badge--animado" : ""
                  }`}
                >
                  {cantidadTotal}
                </span>
              )}
            </NavLink>
          )}

          {!token && (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
          )}

          {token && (
            <div className="navbar__user-menu">
              <button
                type="button"
                className="navbar__user-btn"
                onClick={() => setOpenUserMenu(!openUserMenu)}
              >
                Hola, {nombre} ▼
              </button>

              {openUserMenu && (
                <div className="navbar__dropdown">
                  <button
                    type="button"
                    className="navbar__dropdown-item"
                    onClick={() => {
                      setOpenUserMenu(false);
                      navigate("/perfil");
                    }}
                  >
                    Mi perfil
                  </button>

                  <button
                    type="button"
                    className="navbar__dropdown-item"
                    onClick={() => {
                      setOpenUserMenu(false);
                      handleLogout();
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
