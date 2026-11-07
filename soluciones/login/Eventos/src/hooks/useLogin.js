import { useState } from "react";
import { apiFetch } from "../api/client.js";
import { useAuth } from "./useAuth.js";

// Toda la lógica del formulario de login en un hook (la rúbrica pide `useLogin`).
// El componente LoginForm queda solo con JSX.
export function useLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // POST /api/login -> { ok: true, username, firstName, lastName, rol }
      const usuario = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      login({
        fullName: `${usuario.firstName} ${usuario.lastName}`,
        rol: usuario.rol,
      });
      setUsername("");
      setPassword("");
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
