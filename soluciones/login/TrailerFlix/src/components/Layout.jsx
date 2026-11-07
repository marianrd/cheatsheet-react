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
          <Link to="/" className="brand-title" style={{ color: "#e50914" }}>
            TRAILERFLIX
          </Link>
        </div>
        <nav className="layout-nav">
          {user ? (
            <>
              <span className="user-chip">Bienvenido, {user.username}</span>
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
    </div>
  );
}
