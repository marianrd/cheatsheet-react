const API_BASE = "http://localhost:3000/api";

// Helper único: arma la URL, hace fetch y tira error si la respuesta no es 2xx.
async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const err = new Error(
      response.status === 404 ? "Recurso no encontrado" : `Error ${response.status}`,
    );
    err.status = response.status;
    throw err;
  }
  return response.json();
}

// GET /api/ciudades  ->  { ciudades: [ {id, nombre, temperatura, humedad, condicion} ] }
// OJO: viene envuelto en un objeto, por eso devolvemos data.ciudades
export async function getCiudades() {
  try {
    const data = await request("/ciudades");
    return data.ciudades;
  } catch (error) {
    console.error("Error al cargar ciudades:", error);
    throw error;
  }
}

// GET /api/ciudades/:id  ->  { id, nombre, ... }   (404 si no existe)
export async function getCiudad(id) {
  try {
    return await request(`/ciudades/${id}`);
  } catch (error) {
    console.error("Error al cargar ciudad:", error);
    throw error;
  }
}
