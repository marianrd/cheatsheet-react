const API_BASE = "http://localhost:3000/api";

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const err = new Error(
      response.status === 404 ? "No encontrado" : `Error ${response.status}`,
    );
    err.status = response.status;
    throw err;
  }
  return response.json();
}

// GET /api/recetas?categoria=..&area=..&buscar=..  ->  { success, total, recetas: [...] }
export async function getRecetas(filtros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor) params.set(clave, valor); // los vacíos no se mandan
  });
  const query = params.toString();
  const data = await request(`/recetas${query ? `?${query}` : ""}`);
  return data.recetas;
}

// GET /api/recetas/:id  ->  { success, receta: {...} }   (el id es un STRING, ej "53262")
export async function getReceta(id) {
  const data = await request(`/recetas/${id}`);
  return data.receta;
}

// GET /api/categorias  ->  { success, categorias: [...] }
export async function getCategorias() {
  const data = await request("/categorias");
  return data.categorias;
}

// GET /api/areas  ->  { success, areas: [...] }
export async function getAreas() {
  const data = await request("/areas");
  return data.areas;
}
