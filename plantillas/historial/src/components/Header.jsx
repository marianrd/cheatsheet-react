// components/Header.jsx — navegación. SI PIDEN "badge con la cantidad de recientes" ya está abajo.
import { Link, useLocation } from "react-router-dom";
import { useItemsRecientes } from "../hooks/useItemsRecientes.js";

function Header() {
  const { pathname } = useLocation();
  const { recientes } = useItemsRecientes();

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">🔧 TÍTULO DE LA APP</h1>
        <nav className="nav">
          <Link to="/" className={`nav-btn ${pathname === "/" ? "active" : ""}`}>Inicio</Link>
          <Link to="/recientes" className={`nav-btn ${pathname === "/recientes" ? "active" : ""}`}>
            Recientes ({recientes.length})
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
