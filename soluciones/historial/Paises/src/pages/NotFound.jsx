import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found">
      <div className="error-content">
        <div className="error-emoji">🧭</div>
        <h1 className="error-title">404</h1>
        <h2 className="error-subtitle">Página no encontrada</h2>
        <p className="error-message-text">La página que buscás no existe.</p>
        <Link to="/" className="btn-home">Volver al Inicio</Link>
      </div>
    </div>
  );
}

export default NotFound;
