// pages/NotFound.jsx — 404 (la ruta path="*" de App.jsx)
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default NotFound;
