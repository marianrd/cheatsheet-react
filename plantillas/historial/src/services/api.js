// ═══════════════════════════════════════════════════════════════════
// services/api.js  (PLANTILLA HISTORIAL)
// TODO el fetch pasa por acá. Las 4 constantes de arriba son LO ÚNICO a tocar.
// Primero hacé:  curl http://localhost:3000/api/<endpoint>  y mirá la forma.
// ═══════════════════════════════════════════════════════════════════

// 🔧 CAMBIAR 1: URL base. Mirá el PUERTO en server/*.js (app.listen / PORT).
const API_BASE = "http://localhost:3000/api";

// 🔧 CAMBIAR 2: endpoint de la LISTA.   /paises · /recetas · /ciudades · /items
const ENDPOINT = "/items";

// 🔧 CAMBIAR 3: ¿la LISTA viene envuelta?
//   curl devuelve  [ {...}, {...} ]            -> LISTA_KEY = null
//   curl devuelve  { "ciudades": [ ... ] }     -> LISTA_KEY = "ciudades"
//   curl devuelve  { success, paises: [ ... ]} -> LISTA_KEY = "paises"
const LISTA_KEY = null;

// 🔧 CAMBIAR 4: ¿el DETALLE viene envuelto?
//   curl .../1 devuelve  { id, nombre, ... }        -> DETALLE_KEY = null   (Clima)
//   curl .../ARG devuelve { success, pais: {...} }  -> DETALLE_KEY = "pais"
//   curl .../123 devuelve { success, receta: {...}} -> DETALLE_KEY = "receta"
const DETALLE_KEY = null;

const sacar = (data, clave) => (clave ? data[clave] : data);

// Helper único: arma la URL, hace fetch y TIRA error si no es 2xx
// (fetch NO falla solo con un 404, por eso el if (!response.ok)).
async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const err = new Error(response.status === 404 ? "No encontrado" : `Error ${response.status}`);
    err.status = response.status; // el detalle lo usa para distinguir 404 de otros errores
    throw err;
  }
  return response.json();
}

// ─── LISTA (con filtros opcionales) ────────────────────────────────
// getItems()                              -> /items
// getItems({ categoria: "Beef", buscar: "pollo" }) -> /items?categoria=Beef&buscar=pollo
// Los filtros vacíos NO se mandan. URLSearchParams codifica tildes y espacios solo.
export async function getItems(filtros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor) params.set(clave, valor);
  });
  const query = params.toString();
  const data = await request(`${ENDPOINT}${query ? `?${query}` : ""}`);
  return sacar(data, LISTA_KEY);
}

// ─── DETALLE ───────────────────────────────────────────────────────
// 🔧 SI el id va en la ruta:      /items/:id       (lo normal)
// 🔧 SI el id va por query:       `${ENDPOINT}?id=${id}`
// 🔧 SI el server NO tiene detalle (solo lista): bajá la lista y buscá:
//      const lista = await getItems();
//      const encontrado = lista.find((x) => String(x.id) === String(id));
//      if (!encontrado) { const e = new Error("No encontrado"); e.status = 404; throw e; }
//      return encontrado;
export async function getItem(id) {
  const data = await request(`${ENDPOINT}/${id}`);
  return sacar(data, DETALLE_KEY);
}

// ─── OPCIONES PARA <select> (categorías, continentes, idiomas, áreas...) ─────
// getOpciones("/categorias", "categorias")  -> ["Beef", "Dessert", ...]
// 2º parámetro = clave del envoltorio, o null si ya viene el array directo.
// SI NO HAY filtros desplegables: borrá esta función y Filtros.jsx.
export async function getOpciones(path, clave = null) {
  const data = await request(path);
  return sacar(data, clave);
}
