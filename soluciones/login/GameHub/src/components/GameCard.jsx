import { Link } from "react-router-dom";

// Equivale a retornoCard() de js/app.js
export function GameCard({ game, platform }) {
  const { id, nombre, desarrollador, año, genero, imagen, dlcs_incluidos } = game;
  const dlcPrincipal = dlcs_incluidos && dlcs_incluidos.length > 0 ? dlcs_incluidos[0] : null;

  return (
    <article className="card">
      <Link to={`/juegos/${id}`}>
        <div className="card-image-wrapper">
          <img src={imagen} alt={nombre} title={nombre} />
          <div className="badge-platform">{platform}</div>
        </div>
        <div className="card-body">
          <h3 className="card-title">{nombre}</h3>
          <p>👨‍💻 {desarrollador}</p>
          <div className="card-meta">
            <span>📅 {año}</span>
            <span>🎯 {genero}</span>
          </div>
          {dlcPrincipal && (
            <div>
              <p>🎁 DLC Incluido</p>
              <p>
                <strong>{dlcPrincipal.nombre}</strong>
              </p>
              <p>{dlcPrincipal.tipo}</p>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
