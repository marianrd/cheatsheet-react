import { Link } from "react-router-dom";

// Ruta comodín path="*" -> 404
export function NotFoundPage() {
  return (
    <section className="status">
      <h2>404 - Página no encontrada</h2>
      <p>La ruta que buscás no existe.</p>
      <Link to="/" className="btn-gaming">
        Volver al catálogo
      </Link>
    </section>
  );
}
