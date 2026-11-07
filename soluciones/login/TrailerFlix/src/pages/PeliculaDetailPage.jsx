import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch, posterUrl } from "../api/client.js";

// OJO: el esqueleto trae `export function GameDetailPage` en este archivo pero App.jsx
// importa { PeliculaDetailPage }. Si no coinciden, Vite NO compila. El nombre del
// export tiene que ser igual al del import.
export function PeliculaDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setMovie(null);

    apiFetch(`/contenido/${id}`)
      .then((data) => {
        if (!cancelled) setMovie(data);
      })
      .catch((err) => {
        // 404 -> movie queda null -> "no encontrada"
        if (!cancelled && err.status !== 404) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <section className="status"><h2>⏳ Cargando...</h2></section>;
  if (error) {
    return (
      <section className="status">
        <h2>Error al cargar los detalles de la película.</h2>
        <p>{error.message}</p>
      </section>
    );
  }
  if (!movie) {
    return (
      <section className="status">
        <h2>Película no encontrada.</h2>
        <Link to="/" className="btn-gaming">← Volver al catálogo</Link>
      </section>
    );
  }

  return (
    <section>
      <Link to="/" className="btn-gaming btn-secondary">← Volver al catálogo</Link>
      <div className="detail-layout" style={{ marginTop: "1rem" }}>
        <img className="detail-image" src={posterUrl(movie.poster)} alt={movie.titulo} />
        <div>
          <h2>{movie.titulo}</h2>
          <p><strong>Resumen:</strong> {movie.resumen}</p>
          {movie.trailer && (
            <iframe
              width="560"
              height="315"
              src={movie.trailer}
              title={`Trailer de ${movie.titulo}`}
              frameBorder="0"
              allowFullScreen
            />
          )}
          <p><strong>Reparto:</strong> {movie.reparto}</p>
        </div>
      </div>
    </section>
  );
}
