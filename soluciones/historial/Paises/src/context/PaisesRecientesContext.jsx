import { createContext, useState, useEffect, useCallback } from "react";

export const PaisesRecientesContext = createContext();

// Misma clave y mismo límite que js/app.js (vanilla)
const STORAGE_KEY = "paisesRecientes";
const MAX_RECIENTES = 15;

function leerRecientes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function PaisesRecientesProvider({ children }) {
  // recientes = array de códigos cca3, el más nuevo primero: ["ARG", "BRA", ...]
  const [recientes, setRecientes] = useState(leerRecientes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recientes));
  }, [recientes]);

  // Igual que addToRecientes(): sacar si ya está -> poner primero -> recortar a 15
  const agregarPaisReciente = useCallback((cca3) => {
    setRecientes((prev) => [cca3, ...prev.filter((c) => c !== cca3)].slice(0, MAX_RECIENTES));
  }, []);

  const limpiarRecientes = useCallback(() => setRecientes([]), []);

  return (
    <PaisesRecientesContext.Provider
      value={{ recientes, agregarPaisReciente, limpiarRecientes }}
    >
      {children}
    </PaisesRecientesContext.Provider>
  );
}
