// OJO: TrailerFlix usa el puerto 3001 (no el 3000 que trae el esqueleto copiado de GameHub).
export const API_ORIGIN = "http://localhost:3001";
export const API_BASE_URL = `${API_ORIGIN}/api`;

// En el JSON los posters vienen como "./posters/3.jpg" (relativo).
// En React la página vive en :5173, así que hay que apuntar al servidor Express (:3001),
// que sirve la carpeta posters/ como estático.
export const posterUrl = (poster) =>
  poster ? `${API_ORIGIN}/${poster.replace("./", "")}` : "";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const err = new Error(data?.error || `Error ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return data;
}
