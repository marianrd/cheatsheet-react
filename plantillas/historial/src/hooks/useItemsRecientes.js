// hooks/useItemsRecientes.js — atajo para usar el Context (y avisar si falta el Provider).
// 🔧 Renombrá igual que el Context (ej. useHistorialConsultas). Si el esqueleto ya trae este archivo, solo ajustá los nombres.
import { useContext } from "react";
import { ItemsRecientesContext } from "../context/ItemsRecientesContext.jsx";

export function useItemsRecientes() {
  const context = useContext(ItemsRecientesContext);
  if (!context) {
    throw new Error("useItemsRecientes debe usarse dentro de ItemsRecientesProvider (revisá main.jsx / App.jsx)");
  }
  return context;
}
