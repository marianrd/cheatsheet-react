// ═══════════════════════════════════════════════════════════════════
// hooks/useLogin.js (PLANTILLA LOGIN) — TODA la lógica del formulario (la rúbrica de Eventos pide `useLogin`).
// LoginForm.jsx queda solo con JSX.
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { apiFetch } from "../api/client.js";
import { useAuth } from "./useAuth.js";

// 🔧 CAMBIAR: convierte la RESPUESTA de POST /api/login en lo que guarda el AuthContext.
// Hacé primero:  curl -X POST localhost:3000/api/login -H "Content-Type: application/json" \
//                     -d '{"username":"alexg","password":"alexgpass"}'
//   Responde { id, username, firstName, lastName, rol, ... }  (GameHub, Eventos):
const armarSesion = (r) => ({ fullName: `${r.firstName} ${r.lastName}`, rol: r.rol });
//   Responde { ok: true, username }  (TrailerFlix):
//     const armarSesion = (r) => ({ username: r.username });
//   Responde { token, user: {...} }:
//     const armarSesion = (r) => ({ fullName: r.user.name, rol: r.user.rol, token: r.token });

export function useLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // ⚠️ sin esto el form recarga la página
    setError(null);

    // SI PIDEN validar campos vacíos antes de llamar a la API:
    // if (!username.trim() || !password) { setError("Completá usuario y contraseña"); return; }

    setLoading(true);
    try {
      const respuesta = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      login(armarSesion(respuesta));
      setUsername("");
      setPassword("");
      // SI PIDEN redirigir tras loguear: const navigate = useNavigate(); navigate("/");
    } catch (err) {
      if (err.status === 401) setError("❌ Usuario o contraseña incorrectos");
      else if (err instanceof TypeError) setError("No se pudo conectar con el servidor");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { username, setUsername, password, setPassword, error, loading, handleSubmit };
}
