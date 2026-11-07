// ═══════════════════════════════════════════════════════════════════
// components/Layout.jsx (PLANTILLA LOGIN) — header + login/bienvenida + contenido + footer.
// "Cambio del navbar al haber sesión" (rúbrica) = el ternario {user ? ... : <LoginForm/>}
// ═══════════════════════════════════════════════════════════════════
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoginForm } from "./LoginForm.jsx";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // SI estás en una ruta protegida, volvés al inicio
  };

  return (
    <div className="app-shell">
      <header>
        <span className="brand-title">🔧 TÍTULO DE LA APP</span>
        <nav className="layout-nav">
          <Link to="/">Inicio</Link>

          {user ? (
            <>
              {/* 🔧 CAMBIAR según lo que guarda tu sesión: user.fullName / user.username / user.rol */}
              <span className="user-chip">Bienvenido, {user.fullName} - {user.rol}</span>

              {/* SI PIDEN algo SOLO para admin / VIP / rol X: */}
              {user.rol === "admin" && <Link to="/admin">Panel admin</Link>}

              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <LoginForm />
          )}
        </nav>
      </header>

      <main style={{ width: "100%" }}>{children}</main>

      <footer>
        <p>🔧 Texto del footer © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
