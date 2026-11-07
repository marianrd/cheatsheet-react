import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="error-content">
      <div className="error-emoji">🍽️</div>
      <h1 className="error-title">404</h1>
      <p>Esta página no está en el menú.</p>
      <Link to="/" className="btn-home">Volver al Inicio</Link>
    </div>
  );
}
