import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoginForm } from "./LoginForm.jsx";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header>
        <div className="brand">
          <Link to="/" className="brand-title">🎟️ EventShow</Link>
          <span className="brand-subtitle">Eventos musicales</span>
        </div>
        <nav className="layout-nav">
          {user ? (
            <>
              <span className="user-chip">
                Bienvenido, {user.fullName} - {user.rol}
              </span>
              <button className="btn-gaming btn-secondary" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <LoginForm />
          )}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; {new Date().getFullYear()} EventShow</p>
      </footer>
    </div>
  );
}
