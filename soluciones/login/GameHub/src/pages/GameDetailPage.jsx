import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/client.js";

// Detalle de un videojuego (equivale a juego.html + js/juego.js)
export function GameDetailPage() {
  const { id } = useParams(); // <- reemplaza a URLSearchParams(...).get("id")
  const [game, setGame] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setGame(null);

    async function cargar() {
      try {
        const juego = await apiFetch(`/videojuegos/${id}`);
        // Para saber la plataforma hay que pedir todo y buscar (igual que el vanilla)
        const todos = await apiFetch("/videojuegos");
        const entrada = Object.entries(todos).find(([, lista]) =>
          lista.some((v) => v.id === juego.id),
        );
        if (!cancelled) {
          setGame(juego);
          setPlatform(entrada ? entrada[0] : null);
        }
      } catch (err) {
        // 404 = juego no existe -> game queda en null y mostramos "no encontrado"
        if (!cancelled && err.status !== 404) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    cargar();

    return () => {
      cancelled = true;
    };
  }, [id]); // se vuelve a ejecutar si cambia el :id de la URL

  if (loading) {
    return (
      <section className="status">
        <h2>⏳ Cargando...</h2>
      </section>
    );
  }
  if (error) {
    return (
      <section className="status">
        <h2>❌ Error al cargar los detalles</h2>
        <p>{error.message}</p>
      </section>
    );
  }
  if (!game) {
    return (
      <section className="status">
        <h2>❌ Videojuego no encontrado</h2>
        <Link to="/" className="btn-gaming">Volver al catálogo</Link>
      </section>
    );
  }

  const req = game.requisitos_sistema || {};

  return (
    <section>
      <h1>{game.nombre}</h1>
      <p>👨‍💻 Desarrollador: {game.desarrollador}</p>

      <div className="detail-layout">
        <div>
          <img src={game.imagen} alt={game.nombre} className="detail-image" />
          <ul className="pill-list">
            <li>📅 Año: {game.año}</li>
            <li>🎯 Género: {game.genero}</li>
            <li>⭐ Calificación: {game.calificacion}/10</li>
            <li>🎮 Plataforma: {platform || "N/A"}</li>
          </ul>

          {game.dlcs_incluidos && game.dlcs_incluidos.length > 0 && (
            <div className="detail-section">
              <h3>🎁 DLCs incluidos</h3>
              {game.dlcs_incluidos.map((dlc) => (
                <div key={dlc.nombre}>
                  <p><strong>Nombre:</strong> {dlc.nombre}</p>
                  <p><strong>Tipo:</strong> {dlc.tipo}</p>
                  <p><strong>Contenido adicional:</strong> {dlc.contenido_adicional}</p>
                  <p><strong>Precio:</strong> {dlc.precio}</p>
                  <p>{dlc.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="detail-section">
            <h3>📝 Descripción</h3>
            <p>{game.descripcion}</p>
          </div>

          <div className="detail-section">
            <h3>💻 Requisitos del sistema</h3>
            <ul className="pill-list">
              <li>💻 Procesador: {req.procesador}</li>
              <li>🧠 Memoria: {req.memoria}</li>
              <li>🎨 Gráfica: {req.grafica}</li>
              <li>💾 Almacenamiento: {req.almacenamiento}</li>
            </ul>
          </div>

          <div className="detail-section">
            <h3>🎮 Modos de juego</h3>
            <ul className="pill-list">
              {(game.modos_juego || []).map((modo) => (
                <li key={modo}>{modo}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h3>✨ Características</h3>
            <ul className="pill-list">
              {(game.caracteristicas || []).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/" className="btn-gaming">Volver al catálogo</Link>
      </div>
    </section>
  );
}
