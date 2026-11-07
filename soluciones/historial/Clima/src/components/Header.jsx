import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-brand">
          <h1 className="logo">🌤️ Clima App</h1>
          <p className="slogan">Consulta el clima de tus ciudades favoritas</p>
        </div>
        <nav className="nav">
          <Link
            to="/"
            className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
          >
            Inicio
          </Link>
          <Link
            to="/recientes"
            className={`nav-btn ${
              location.pathname === "/recientes" ? "active" : ""
            }`}
          >
            Recientes
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
