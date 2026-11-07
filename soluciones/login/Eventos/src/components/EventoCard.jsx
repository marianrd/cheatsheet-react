import { Link } from "react-router-dom";

// Equivale a retornoCard() de js/app.js
export function EventoCard({ evento }) {
  const { id, nombre, artista, fecha, imagen, genero, precio, tickets_disponibles } = evento;

  return (
    <article className="card">
      <Link to={`/eventos/${id}`}>
        <div className="card-image-wrapper">
          <img src={imagen} alt={nombre} title={nombre} />
          <div className="badge-platform">{genero}</div>
        </div>
        <div className="card-body">
          <h3 className="card-title">{nombre}</h3>
          <p>🎤 {artista}</p>
          <div className="card-meta">
            <span>📅 {fecha}</span>
            <span>🎫 ${precio}</span>
          </div>
          {/* Render condicional: solo si quedan pocos tickets */}
          {tickets_disponibles < 500 && (
            <div>
              <p>🔥 Tickets Agotándose</p>
              <p><strong>Solo {tickets_disponibles} restantes</strong></p>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
