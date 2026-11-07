import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { apiFetch } from "../api/client.js";

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Ingresa tu usuario");
      return;
    }

    setLoading(true);
    try {
      // La API de TrailerFlix responde { ok: true, username: "..." }
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      login({ username: data.username });
      setUsername("");
      setPassword("");
    } catch (err) {
      if (err.status === 401) setError("Usuario o contraseña incorrectos");
      else if (err instanceof TypeError)
        setError("No se pudo conectar con el servidor. ¿Está el backend en marcha?");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button type="submit" className="btn-gaming" disabled={loading}>
        {loading ? "Entrando…" : "Ingresar"}
      </button>
      {error && (
        <p style={{ margin: 0, color: "#ffb3b3", fontSize: "0.8rem" }}>{error}</p>
      )}
    </form>
  );
}
