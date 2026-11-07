import { Link } from "react-router-dom";
import { posterUrl } from "../api/client.js";

// Equivale a retornoCard() de js/app.js
export function VideoCard({ item }) {
  const { id, poster, titulo, categoria } = item;

  return (
    <article className="card">
      <Link to={`/peliculas/${id}`}>
        <img src={posterUrl(poster)} alt={titulo} title={titulo} />
        <div className="card-body">
          <h3 className="card-title">{titulo}</h3>
          <p>{categoria}</p>
        </div>
      </Link>
    </article>
  );
}
