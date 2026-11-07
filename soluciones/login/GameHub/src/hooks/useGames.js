import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

// Carga GET /videojuegos -> { PC: [...], PlayStation: [...], Xbox: [...], Nintendo: [...] }
export function useGames() {
  const [gamesByPlatform, setGamesByPlatform] = useState(null);
  const [loading, setLoading] = useState(true); // arranca cargando
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // si el componente se desmonta, no tocamos el estado

    apiFetch("/videojuegos")
      .then((data) => {
        if (!cancelled) setGamesByPlatform(data);
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
  }, []); // [] = solo al montar

  return { gamesByPlatform, loading, error };
}
