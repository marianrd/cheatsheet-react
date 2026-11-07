import { useContext } from "react";
import { PaisesRecientesContext } from "../context/PaisesRecientesContext";

export function usePaisesRecientes() {
  const context = useContext(PaisesRecientesContext);

  if (!context) {
    throw new Error(
      "usePaisesRecientes debe usarse dentro de PaisesRecientesProvider"
    );
  }

  return context;
}
