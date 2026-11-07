import { useContext } from "react";
import { HistorialConsultasContext } from "../context/HistorialConsultasContext";

export function useHistorialConsultas() {
  const context = useContext(HistorialConsultasContext);

  if (!context) {
    throw new Error(
      "useHistorialConsultas debe usarse dentro de HistorialConsultasProvider"
    );
  }

  return context;
}
