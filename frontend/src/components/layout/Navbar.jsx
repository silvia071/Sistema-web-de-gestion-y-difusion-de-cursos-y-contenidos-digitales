import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar() {
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

          <NavLink
            to="/carrito"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Carrito
          </NavLink>

          <NavLink
            to="/perfil"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Perfil
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
