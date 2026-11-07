import { useParams, Link } from "react-router-dom";
import { useEvento } from "../hooks/useEventos.js";

// OJO: el esqueleto trae `export function GameDetailPage` en este archivo pero App.jsx
// importa { EventoDetailPage } -> hay que renombrar el export o Vite no compila.
export function EventoDetailPage() {
  const { id } = useParams();
  const { evento, loading, error } = useEvento(id);

  if (loading) return <section className="status"><h2>⏳ Cargando detalles del Show...</h2></section>;
  if (error) {
    return (
      <section className="status">
        <h2>Falló la conexión con la ticketera.</h2>
        <p>{error.message}</p>
      </section>
    );
  }
  if (!evento) {
    return (
      <section className="status">
        <h2>Evento no encontrado (404)</h2>
        <Link to="/" className="btn-gaming">Atrás a la cartelera</Link>
      </section>
    );
  }

  const invitados = evento.invitados || [];

  return (
    <section>
      <h1>{evento.nombre}</h1>
      <p>🎵 Artista Principal: {evento.artista}</p>

      <div className="detail-layout">
        <div>
          <img src={evento.imagen} alt={evento.nombre} className="detail-image" />
          <ul className="pill-list">
            <li>📍 Ubicación: {evento.ubicacion}</li>
            <li>🎟️ Costo: ${evento.precio}</li>
            <li>👥 Aforo Restante: {evento.tickets_disponibles} Tickets</li>
          </ul>
        </div>

        <div>
          <div className="detail-section">
            <h3>📖 Sinopsis del Tour</h3>
            <p>{evento.descripcion}</p>
          </div>

          <div className="detail-section">
            <h3>🎸 Bandas Invitadas</h3>
            {/* Render condicional: lista vacía -> mensaje */}
            {invitados.length > 0 ? (
              <ul className="pill-list">
                {invitados.map((invitado) => (
                  <li key={invitado}>{invitado}</li>
                ))}
              </ul>
            ) : (
              <p>Sin invitados confirmados</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/" className="btn-gaming">Atrás a la cartelera</Link>
      </div>
    </section>
  );
}
