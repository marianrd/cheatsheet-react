// ═══════════════════════════════════════════════════════════════════
// context/ItemsRecientesContext.jsx  (PLANTILLA HISTORIAL)  ← vale 25 pts
// Estado global del historial + persistencia en localStorage.
// Orden de lectura: constantes -> leer() -> Provider (estado, efecto, acciones, value)
// ═══════════════════════════════════════════════════════════════════
import { createContext, useState, useEffect, useCallback } from "react";

export const ItemsRecientesContext = createContext(null);

// 🔧 CAMBIAR: la clave de localStorage = la que usa el vanilla (buscá localStorage.setItem en js/*.js)
//    Clima "historialConsultas" · Paises "paisesRecientes" · Recetas "recetasRecientes"
const STORAGE_KEY = "itemsRecientes";

// 🔧 SI PIDEN MAX / "últimas N consultas" -> poné N (el vanilla suele tener MAX_RECIENTES o slice(0, N)).
//    SI NO HAY LÍMITE (Clima) -> Infinity
const MAX_RECIENTES = 15;

// Se ejecuta UNA vez (lazy init). El try/catch evita que un JSON roto tire la app.
function leer() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function ItemsRecientesProvider({ children }) {
  // Por defecto recientes = array de IDs, el más nuevo primero:  ["ARG", "BRA", ...]
  // (más abajo hay variante para guardar objetos { id, nombre, fecha } como Clima)
  const [recientes, setRecientes] = useState(leer);

  // Persistir cada vez que cambia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recientes));
  }, [recientes]);

  // ─── AGREGAR ──────────────────────────────────────────────────────
  // VERSIÓN A (default): sacar si ya estaba -> poner primero -> recortar a MAX
  //   = sin duplicados + más nuevo primero + límite. Es lo que piden Paises y Recetas.
  const agregarItemReciente = useCallback((id) => {
    setRecientes((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECIENTES));
  }, []);

  // VERSIÓN B — SI PIDEN guardar OBJETOS con fecha, "sin duplicados", orden de llegada (Clima):
  //   (cambiar también Recientes.jsx a la VARIANTE B y borrar la versión A de arriba)
  // const agregarItemReciente = useCallback((id, nombre) => {
  //   setRecientes((prev) =>
  //     prev.some((r) => r.id === id)
  //       ? prev                                                       // ya estaba: no cambia nada
  //       : [...prev, { id, nombre, fecha: new Date().toLocaleString() }].slice(-MAX_RECIENTES)
  //   );
  // }, []);
  //   · "más nuevo primero" en B -> [{ id, nombre, fecha: ... }, ...prev].slice(0, MAX_RECIENTES)
  //   · "si ya existe, subirlo arriba y refrescar fecha" -> usá la versión A con objetos:
  //       [{ id, nombre, fecha: ... }, ...prev.filter((r) => r.id !== id)].slice(0, MAX_RECIENTES)

  // ─── OTRAS ACCIONES (dejá solo las que pidan) ─────────────────────
  const limpiarRecientes = useCallback(() => setRecientes([]), []);

  // SI PIDEN "borrar UNO del historial" (versión A: ids):
  const quitarReciente = useCallback((id) => {
    setRecientes((prev) => prev.filter((r) => r !== id));
  }, []);

  // SI PIDEN "contador de visitas":  guardar { id, visitas } y en agregar sumar:
  //   const ex = prev.find(r => r.id === id);
  //   ex ? prev.map(r => r.id === id ? { ...r, visitas: r.visitas + 1 } : r) : [...prev, { id, visitas: 1 }]

  // SI PIDEN "favoritos" (toggle): otro Context igual a este con
  //   const toggleFavorito = (id) => setFavs(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);
  //   y  esFavorito = (id) => favs.includes(id)

  return (
    <ItemsRecientesContext.Provider
      value={{ recientes, agregarItemReciente, limpiarRecientes, quitarReciente }}
    >
      {children}
    </ItemsRecientesContext.Provider>
  );
}
