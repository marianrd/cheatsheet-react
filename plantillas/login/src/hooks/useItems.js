// ═══════════════════════════════════════════════════════════════════
// hooks/useItems.js (PLANTILLA LOGIN) — lista (useItems) y detalle (useItem) con loading/error.
// Eventos pide `useEventos`; TrailerFlix `useContenido`; GameHub `useGames`: renombrá el hook.
// ═══════════════════════════════════════════════════════════════════
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

// 🔧 CAMBIAR el endpoint de la lista:  /videojuegos · /contenido · /eventos
const ENDPOINT = "/items";

export function useItems() {
  // GameHub: la lista viene AGRUPADA { PC:[..], Xbox:[..] } -> el estado inicial es null, no []
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // si el componente se desmonta, no tocar el estado
    apiFetch(ENDPOINT)
      // 🔧 SI VIENE ENVUELTO: setItems(data.items)
      .then((data) => { if (!cancelled) setItems(data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []); // [] = solo al montar

  return { items, loading, error };
}

// Detalle: GET /items/:id   (404 -> item = null y SIN error => la página dice "no encontrado")
export function useItem(id) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); // al cambiar de id hay que volver a "cargando"
    setError(null);
    setItem(null);

    apiFetch(`${ENDPOINT}/${id}`)
      .then((data) => { if (!cancelled) setItem(data); })
      .catch((err) => { if (!cancelled && err.status !== 404) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]); // ⚠️ [id]: si falta, no recarga al cambiar de item; si ponés un objeto, bucle infinito

  return { item, loading, error };
}
