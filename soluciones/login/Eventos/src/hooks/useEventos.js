import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

// Lista: GET /api/eventos
export function useEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/eventos")
      .then((data) => {
        if (!cancelled) setEventos(data);
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

  return { eventos, loading, error };
}

// Detalle: GET /api/eventos/:id   (404 -> evento = null, sin error)
export function useEvento(id) {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEvento(null);

    apiFetch(`/eventos/${id}`)
      .then((data) => {
        if (!cancelled) setEvento(data);
      })
      .catch((err) => {
        if (!cancelled && err.status !== 404) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { evento, loading, error };
}
