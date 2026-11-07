// Cliente API centralizado. TODO fetch de la app pasa por acá.
export const API_BASE_URL = "http://localhost:3000/api";

// apiFetch("/videojuegos")                       -> GET
// apiFetch("/login", { method: "POST", body: JSON.stringify({...}) })  -> POST
export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // El body puede venir vacío o no ser JSON: no queremos que eso rompa todo.
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const err = new Error(data?.error || `Error ${response.status}`);
    err.status = response.status; // 404, 401, 500...
    throw err;
  }
  return data;
}
