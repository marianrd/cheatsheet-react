// ═══════════════════════════════════════════════════════════════════
// components/RutaProtegida.jsx — SI PIDEN "solo logueados" o "solo admin/VIP" para una ruta.
// Uso en App.jsx:
//   <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
//   <Route path="/admin" element={<RutaProtegida rol="admin"><Admin /></RutaProtegida>} />
// Si NO lo piden, borrá este archivo.
// ═══════════════════════════════════════════════════════════════════
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function RutaProtegida({ rol, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;          // sin sesión -> al inicio
  if (rol && user.rol !== rol) return <Navigate to="/" replace />; // rol incorrecto
  return children;
}
