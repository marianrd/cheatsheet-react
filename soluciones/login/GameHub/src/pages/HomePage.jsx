import { useGames } from "../hooks/useGames.js";
import { GameCard } from "../components/GameCard.jsx";

const PLATFORMS = ["PC", "PlayStation", "Xbox", "Nintendo"];

// Catálogo agrupado por plataforma (equivale a js/app.js)
export function HomePage() {
  const { gamesByPlatform, loading, error } = useGames();

  if (loading) {
    return (
      <section className="status">
        <h2>⏳ Cargando videojuegos...</h2>
        <p>Estamos preparando tu catálogo gaming 🎮</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="status">
        <h2>⚠️ Error al cargar videojuegos</h2>
        <p>{error.message}</p>
      </section>
    );
  }

  if (!gamesByPlatform || typeof gamesByPlatform !== "object") {
    return (
      <section className="status">
        <h2>⚠️ Sin datos</h2>
        <p>No se recibieron videojuegos desde la API.</p>
      </section>
    );
  }

  // Solo las plataformas que tienen juegos (como hace el vanilla)
  const plataformasConJuegos = PLATFORMS.filter(
    (plat) => gamesByPlatform[plat] && gamesByPlatform[plat].length > 0,
  );

  return (
    <section>
      <h1>Catálogo de videojuegos</h1>

      {plataformasConJuegos.length === 0 && (
        <p className="status">No hay videojuegos para mostrar (sin resultados).</p>
      )}

      <div className="grid-platforms">
        {plataformasConJuegos.map((plat) => (
          <section key={plat} className="platform-section">
            <h2>🎮 {plat}</h2>
            <div className="games-grid">
              {gamesByPlatform[plat].map((juego) => (
                <GameCard key={juego.id} game={juego} platform={plat} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
