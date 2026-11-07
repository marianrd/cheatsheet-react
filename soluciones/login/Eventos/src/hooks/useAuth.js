import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// Atajo para usar el contexto: const { user, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }

  return ctx;
}
