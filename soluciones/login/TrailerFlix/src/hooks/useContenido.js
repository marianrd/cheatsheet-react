import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

// GET /api/contenido -> array de películas/series
export function useContenido() {
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/contenido")
      .then((data) => {
        if (!cancelled) setContenido(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { contenido, loading, error };
}
