import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { apiFetch } from "../api/client.js";

// Equivale al <form id="loginForm"> + login.js (vanilla).
export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // evita que el form recargue la página
    setError(null);
    setLoading(true);

    try {
      // POST /api/login  ->  devuelve el usuario completo si está OK, 401 si no
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
      if (err.status === 401) {
        setError(new Error("❌ Usuario o contraseña incorrectos"));
      } else if (err instanceof TypeError) {
        setError(new Error("No se pudo conectar con el servidor"));
      } else {
        setError(err);
      }
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
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn-gaming" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
      {error && (
        <p style={{ marginTop: "0.25rem", color: "#ffb3b3", fontSize: "0.8rem" }}>
          {error.message}
        </p>
      )}
    </form>
  );
}
