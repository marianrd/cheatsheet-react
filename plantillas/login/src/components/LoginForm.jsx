// components/LoginForm.jsx — solo JSX; la lógica está en hooks/useLogin.js
// ⚠️ Formulario CONTROLADO (value + onChange). Prohibido document.getElementById(...).value
import { useLogin } from "../hooks/useLogin.js";

export function LoginForm() {
  const { username, setUsername, password, setPassword, error, loading, handleSubmit } = useLogin();

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
      {error && <span style={{ color: "#ffb3b3", fontSize: "0.8rem" }}>{error}</span>}
    </form>
  );
}
