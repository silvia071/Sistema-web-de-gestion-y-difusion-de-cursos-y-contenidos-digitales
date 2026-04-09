import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate(); // 👈 VA ADENTRO DEL COMPONENTE

  return (
    <header className="header">
      <img
        src={logo}
        alt="Mundo Dev"
        className="logo"
        onClick={() => navigate("/")} // 👈 click al home
      />
    </header>
  );
}

export default Header;
