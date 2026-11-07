import { createContext, useState, useEffect, useCallback } from "react";

export const HistorialConsultasContext = createContext();

// Misma clave que usa js/clima.js (vanilla)
const STORAGE_KEY = "historialConsultas";

// Se ejecuta UNA vez (lazy init de useState): lee lo guardado o arranca vacío.
function leerHistorial() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return []; // si el JSON está roto, no explotamos
  }
}

export function HistorialConsultasProvider({ children }) {
  const [historial, setHistorial] = useState(leerHistorial);

  // Cada vez que cambia `historial`, lo persistimos.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  }, [historial]);

  // Sin duplicados (por id). useCallback = la función no cambia entre renders,
  // así se puede poner en el array de dependencias de un useEffect sin loops.
  const agregarConsulta = useCallback((id, nombre) => {
    setHistorial((prev) => {
      if (prev.some((consulta) => consulta.id === id)) return prev; // ya estaba: no cambia nada
      return [...prev, { id, ciudad: nombre, fecha: new Date().toLocaleString() }];
    });
  }, []);

  const limpiarHistorial = useCallback(() => setHistorial([]), []);

  return (
    <HistorialConsultasContext.Provider
      value={{ historial, agregarConsulta, limpiarHistorial }}
    >
      {children}
    </HistorialConsultasContext.Provider>
  );
}
