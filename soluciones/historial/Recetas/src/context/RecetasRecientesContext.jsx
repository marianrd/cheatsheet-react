import { createContext, useState, useEffect, useCallback } from "react";

export const RecetasRecientesContext = createContext();

// Misma clave y mismo límite que js/app.js (vanilla)
const STORAGE_KEY = "recetasRecientes";
const MAX_RECIENTES = 15;

function leerRecientes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function RecetasRecientesProvider({ children }) {
  // recientes = ids (strings), el más nuevo primero: ["53262", "52772", ...]
  const [recientes, setRecientes] = useState(leerRecientes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recientes));
  }, [recientes]);

  // sacar si ya estaba -> poner primero -> recortar (no crece infinito)
  const agregarRecetaReciente = useCallback((id) => {
    setRecientes((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECIENTES));
  }, []);

  const limpiarRecientes = useCallback(() => setRecientes([]), []);

  return (
    <RecetasRecientesContext.Provider
      value={{ recientes, agregarRecetaReciente, limpiarRecientes }}
    >
      {children}
    </RecetasRecientesContext.Provider>
  );
}
