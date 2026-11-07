import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoginForm } from "./LoginForm.jsx";

// Header + login + footer. Todo lo que cambia según haya sesión o no se decide acá.
export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header>
        <div className="brand">
          <span className="brand-title">🎮 GAMEHUB</span>
          <span className="brand-subtitle">Tu catálogo de videojuegos definitivo</span>
        </div>
        <nav className="layout-nav">
          <Link to="/">Inicio</Link>

          {user ? (
            <>
              <span className="user-chip">
                Bienvenido, {user.fullName} - {user.rol}
              </span>
              <button className="btn-gaming btn-secondary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <LoginForm />
          )}
        </nav>
      </header>
      <main style={{ width: "100%" }}>{children}</main>
      <footer>
        <p>🎮 GameHub React © {currentYear} - Examen de Migración a React | Juega Responsable 🕹️</p>
      </footer>
    </div>
  );
}
