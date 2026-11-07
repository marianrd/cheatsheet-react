import { useContext } from "react";
import { RecetasRecientesContext } from "../context/RecetasRecientesContext.jsx";

export function useRecetasRecientes() {
  const ctx = useContext(RecetasRecientesContext);
  if (!ctx) {
    throw new Error("useRecetasRecientes debe usarse dentro de <RecetasRecientesProvider>");
  }
  return ctx;
}
