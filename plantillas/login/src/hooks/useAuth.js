// hooks/useAuth.js — atajo para usar el AuthContext
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider> (revisá main.jsx)");
  }
  return context;
}
