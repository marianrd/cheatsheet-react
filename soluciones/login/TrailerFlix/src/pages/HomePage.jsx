import { useContenido } from "../hooks/useContenido.js";
import { VideoCard } from "../components/VideoCard.jsx";

// Mismos géneros (y mismo .sort()) que js/app.js
const GENEROS = [
  "Ciencia Ficción", "Drama", "Suceso Real", "Suspenso", "Fantasía",
  "Familia", "Acción", "Terror", "Aventura",
].sort();

export function HomePage() {
  const { contenido, loading, error } = useContenido();

  if (loading) {
    return (
      <section className="status">
        <h2>⏳ Cargando catálogo...</h2>
      </section>
    );
  }
  if (error) {
    return (
      <section className="status">
        <h2>La función está demorada</h2>
        <p>Estamos haciendo algunos ajustes 🍿</p>
        <p>{error.message}</p>
      </section>
    );
  }
  if (contenido.length === 0) {
    return (
      <section className="status">
        <h2>No hay títulos para mostrar</h2>
      </section>
    );
  }

  return (
    <section>
      {GENEROS.map((gen) => {
        // El campo por el que se agrupa en el vanilla es `gen`
        const delGenero = contenido.filter((c) => c.gen === gen);
        if (delGenero.length === 0) return null; // oculta géneros vacíos
        return (
          <article key={gen} className="platform-section">
            <h2>{gen}</h2>
            <div className="games-grid">
              {delGenero.map((item) => (
                <VideoCard key={item.id} item={item} />
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
