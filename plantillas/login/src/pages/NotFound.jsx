// pages/NotFound.jsx — 404 (la ruta path="*" de App.jsx)
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="status">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
