import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__content">
        <div className="navbar__logo">
          <Link to="/">Mundo Dev</Link>
        </div>

        <nav className="navbar__links">
          <Link to="/">Inicio</Link>
          <Link to="/cursos">Cursos</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/perfil">Perfil</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;