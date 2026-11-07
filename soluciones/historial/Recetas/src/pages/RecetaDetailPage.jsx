import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loading } from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { getReceta } from "../services/api.js";
import { useRecetasRecientes } from "../hooks/useRecetasRecientes.js";
import { getYouTubeEmbedUrl } from "../utils/youtube.js";

export function RecetaDetailPage() {
  const { id } = useParams();
  const { agregarRecetaReciente } = useRecetasRecientes();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setReceta(null);

    getReceta(id)
      .then((data) => {
        if (cancelled) return;
        setReceta(data);
        agregarRecetaReciente(data.idMeal); // alimenta el historial global
      })
      .catch((err) => {
        if (!cancelled)
          setError(err.status === 404 ? "Receta no encontrada." : "Error al cargar la receta.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, agregarRecetaReciente]);

  // strIngredient1..20 + strMeasure1..20  ->  array [{nombre, medida}]
  const ingredientes = [];
  if (receta) {
    for (let i = 1; i <= 20; i++) {
      const nombre = receta[`strIngredient${i}`];
      const medida = receta[`strMeasure${i}`];
      if (nombre && nombre.trim()) ingredientes.push({ nombre, medida: medida || "" });
    }
  }
  const youtubeEmbedUrl = receta ? getYouTubeEmbedUrl(receta.strYoutube) : null;

  return (
    <>
      <Link to="/" className="back-btn">← Volver al catálogo</Link>

      {loading && <Loading texto="Cargando receta..." />}
      {error && <ErrorMessage message={error} />}

      {receta && (
        <div className="detalle-container">
          <div className="detalle-header">
            <div className="detalle-image">
              <img src={receta.strMealThumb} alt={receta.strMeal} />
            </div>
            <div className="detalle-info">
              <h2>{receta.strMeal}</h2>
              <div className="detalle-meta">
                <span>📁 <strong>Categoría:</strong> {receta.strCategory || "N/A"}</span>
                <span>🌍 <strong>Área:</strong> {receta.strArea || "N/A"}</span>
              </div>
            </div>
          </div>

          {youtubeEmbedUrl && (
            <div className="detalle-section">
              <h3>Video Tutorial</h3>
              <div className="video-container">
                <iframe
                  src={youtubeEmbedUrl}
                  title={`Video tutorial de ${receta.strMeal}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {ingredientes.length > 0 && (
            <div className="detalle-section">
              <h3>Ingredientes</h3>
              <ul className="ingredientes-list">
                {ingredientes.map((ing, index) => (
                  <li key={`${ing.nombre}-${index}`}>
                    <strong>{ing.nombre}</strong> {ing.medida && `- ${ing.medida}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {receta.strInstructions && (
            <div className="detalle-section">
              <h3>Instrucciones</h3>
              <div className="instrucciones">{receta.strInstructions}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
