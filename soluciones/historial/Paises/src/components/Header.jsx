import { NavLink } from "react-router-dom";

// NavLink = Link que sabe si está "activo" (reemplaza al .nav-btn.active manual del vanilla)
const claseNav = ({ isActive }) => `nav-btn ${isActive ? "active" : ""}`;

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-brand">
          <h1 className="logo">🌍 Atlas Digital</h1>
          <p className="slogan">Explorador Mundial</p>
        </div>
        <nav className="nav">
          {/* `end` = "/" solo está activo en "/" exacto, no en todas las rutas */}
          <NavLink to="/" end className={claseNav}>
            Inicio
          </NavLink>
          <NavLink to="/recientes" className={claseNav}>
            Recientes
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
