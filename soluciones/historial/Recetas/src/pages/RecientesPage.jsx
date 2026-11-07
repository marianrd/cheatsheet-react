import { useState, useEffect } from "react";
import { RecetaCard } from "../components/RecetaCard.jsx";
import { Loading } from "../components/Loading.jsx";
import { getReceta } from "../services/api.js";
import { useRecetasRecientes } from "../hooks/useRecetasRecientes.js";

export function RecientesPage() {
  const { recientes, limpiarRecientes } = useRecetasRecientes();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  // En localStorage solo hay ids -> se cruzan con el API (en paralelo) para armar las cards
  useEffect(() => {
    let cancelled = false;

    if (recientes.length === 0) {
      setRecetas([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.allSettled(recientes.map((id) => getReceta(id))).then((resultados) => {
      if (cancelled) return;
      setRecetas(resultados.filter((r) => r.status === "fulfilled").map((r) => r.value));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [recientes]);

  return (
    <>
      <h2 className="page-title">Recetas Recientes</h2>

      {loading && <Loading />}

      {!loading && recetas.length === 0 && (
        <p className="empty-message">No has visto ninguna receta aún.</p>
      )}

      {!loading && recetas.length > 0 && (
        <>
          <div className="recetas-grid">
            {recetas.map((receta) => (
              <RecetaCard key={receta.idMeal} receta={receta} />
            ))}
          </div>
          <button className="back-btn" onClick={limpiarRecientes}>
            🗑️ Limpiar recientes
          </button>
        </>
      )}
    </>
  );
}
