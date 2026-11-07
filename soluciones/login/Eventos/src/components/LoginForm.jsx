import { useLogin } from "../hooks/useLogin.js";

export function LoginForm() {
  const { username, setUsername, password, setPassword, error, loading, handleSubmit } =
    useLogin();

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
        {loading ? "Ingresando..." : "Login"}
      </button>
      {error && (
        <p style={{ margin: 0, color: "#ffb3b3", fontSize: "0.8rem" }}>{error}</p>
      )}
    </form>
  );
}
