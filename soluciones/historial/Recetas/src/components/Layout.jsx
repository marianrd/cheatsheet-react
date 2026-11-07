import { NavLink } from "react-router-dom";

const claseNav = ({ isActive }) => `nav-btn ${isActive ? "active" : ""}`;

// Header + footer fijos. {children} = la página que toca según la ruta.
export function Layout({ children }) {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-brand">
            <h1 className="logo">🍳 Recetario Estrafalario</h1>
            <p className="slogan">Sabor garantizado... o te devolvemos tu dinero</p>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={claseNav}>Inicio</NavLink>
            <NavLink to="/recientes" className={claseNav}>Recientes</NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">{children}</div>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="slogan-footer">Sabor garantizado... o te devolvemos tu dinero</p>
          <p>&copy; {new Date().getFullYear()} Recetario Estrafalario - Tu Cocina Digital</p>
        </div>
      </footer>
    </>
  );
}
