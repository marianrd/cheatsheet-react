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

// GET /api/paises?continente=..&idioma=..&buscar=..  ->  { success, total, paises: [...] }
// URLSearchParams arma el query string y codifica tildes/espacios solo
// (reemplaza al encodeURIComponent manual del vanilla). Los filtros vacíos se omiten.
export async function getPaises(filtros = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([clave, valor]) => {
      if (valor) params.set(clave, valor);
    });
    const query = params.toString();
    const data = await request(`/paises${query ? `?${query}` : ""}`);
    return data.paises;
  } catch (error) {
    console.error("Error al cargar países:", error);
    throw error;
  }
}

// GET /api/paises/:cca3  ->  { success, pais: {...} }   (404 si no existe)
export async function getPais(cca3) {
  try {
    const data = await request(`/paises/${cca3}`);
    return data.pais;
  } catch (error) {
    console.error("Error al cargar país:", error);
    throw error;
  }
}

// GET /api/continentes  ->  { success, continentes: ["África", ...] }
export async function getContinentes() {
  try {
    const data = await request("/continentes");
    return data.continentes;
  } catch (error) {
    console.error("Error al cargar continentes:", error);
    throw error;
  }
}

// GET /api/idiomas  ->  { success, idiomas: ["Español", ...] }
export async function getIdiomas() {
  try {
    const data = await request("/idiomas");
    return data.idiomas;
  } catch (error) {
    console.error("Error al cargar idiomas:", error);
    throw error;
  }
}
