// ═══════════════════════════════════════════════════════════════════
// api/client.js (PLANTILLA LOGIN) — TODO fetch pasa por apiFetch().
//   apiFetch("/items")                                   -> GET
//   apiFetch("/login", { method:"POST", body: JSON.stringify({...}) }) -> POST
// ═══════════════════════════════════════════════════════════════════

// 🔧 CAMBIAR 1: puerto. GameHub y Eventos = 3000 · TrailerFlix = 3001 (¡el esqueleto trae 3000 copiado!)
export const API_ORIGIN = "http://localhost:3000";
export const API_BASE_URL = `${API_ORIGIN}/api`;

// SI las IMÁGENES vienen relativas ("./posters/3.jpg") y las sirve el Express (TrailerFlix):
//   <img src={imgUrl(item.poster)} />
// SI vienen como URL completa (https://...), no hace falta y usás item.imagen directo.
export const imgUrl = (ruta) => (ruta ? `${API_ORIGIN}/${ruta.replace("./", "")}` : "");

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // SI piden TOKEN (JWT) en rutas protegidas:
      // ...(localStorage.getItem("token") && { Authorization: `Bearer ${localStorage.getItem("token")}` }),
    },
    ...options,
  });

  // El body puede venir vacío o no ser JSON: eso no debe romper todo.
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // fetch NO falla solo con 401/404/500 -> hay que tirar el error a mano.
  if (!response.ok) {
    const err = new Error(data?.error || `Error ${response.status}`);
    err.status = response.status; // 401 login malo · 404 no existe · 500 server
    throw err;
  }
  return data;
}
