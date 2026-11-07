# 03 · Tipo LOGIN (GameHub · TrailerFlix · Eventos)

**Piezas:** `main.jsx` (Router+AuthProvider) · `App.jsx` (rutas) · `api/client.js` · `AuthContext` · `useAuth` · `LoginForm` · `Layout` · hook de datos · `Card` · `HomePage` · `DetailPage` · `NotFound`.

Soluciones completas y probadas: `soluciones/login/{GameHub,TrailerFlix,Eventos}/src/`.
Si el parcial es de este tipo, **lo más rápido es copiar la solución más parecida y adaptar** (ver "Qué cambiar" al final).

---

## Paso 1 — `main.jsx`: el ORDEN importa

```jsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>        {/* habilita Link / useNavigate / useParams */}
      <AuthProvider>       {/* habilita useAuth() */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```
> Los esqueletos traen `Layout` usando `useAuth` y `Link`, pero **ni Router ni AuthProvider están puestos** → sin esto: pantalla blanca con "useAuth debe usarse dentro de un AuthProvider".

## Paso 2 — `api/client.js` (un solo lugar para el fetch)

```js
export const API_BASE_URL = "http://localhost:3000/api";   // ← TrailerFlix: 3001 !!

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const err = new Error(data?.error || `Error ${response.status}`);
    err.status = response.status;          // para distinguir 404 / 401
    throw err;
  }
  return data;
}
```
Uso: `apiFetch("/videojuegos")` · `apiFetch("/login", { method: "POST", body: JSON.stringify({ username, password }) })`.

## Paso 3 — hook de datos (`useGames` / `useContenido` / `useEventos`)

```js
export function useContenido() {
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    apiFetch("/contenido")                                   // ← CAMBIAR endpoint
      .then((d) => { if (!cancelled) setContenido(d); })
      .catch((e) => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  return { contenido, loading, error };
}
```

## Paso 4 — Card + HomePage + rutas

Convertí `retornoCard` (ver [02](02-de-vanilla-a-react.md)). HomePage:

```jsx
export function HomePage() {
  const { contenido, loading, error } = useContenido();
  if (loading) return <p>⏳ Cargando...</p>;
  if (error)   return <p>Error: {error.message}</p>;
  if (contenido.length === 0) return <p>No hay resultados</p>;
  return <div>{contenido.map((c) => <VideoCard key={c.id} item={c} />)}</div>;
}
```
`App.jsx`:
```jsx
<Layout>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/peliculas/:id" element={<PeliculaDetailPage />} />   {/* ← CAMBIAR ruta */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Layout>
```

## Paso 5 — Página de detalle

```jsx
export function PeliculaDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setMovie(null);
    apiFetch(`/contenido/${id}`)
      .then((d) => { if (!cancelled) setMovie(d); })
      .catch((e) => { if (!cancelled && e.status !== 404) setError(e); })   // 404 => movie queda null
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);                                    // ← [id], no []

  if (loading) return <p>Cargando...</p>;
  if (error)   return <p>Error: {error.message}</p>;
  if (!movie)  return <p>No encontrada</p>;     // ← "juego/película no encontrada" que pide la rúbrica
  return ( /* JSX del detalle: copiar de movie.js */ );
}
```
Defensa contra `undefined` (la rúbrica de TrailerFlix lo pide): `game.modos_juego || []`, `evento.invitados?.length > 0`, `req.procesador`.

## Paso 6 — AuthContext (copiar tal cual y ajustar las claves/campos)

```jsx
import { createContext, useState } from "react";

const KEY_USUARIO = "usuario";      // ← MISMAS claves que js/login.js (vanilla)
const KEY_ROL = "rol";              // (TrailerFlix guarda solo "usuario")

export const AuthContext = createContext(null);

function leerSesion() {
  const fullName = localStorage.getItem(KEY_USUARIO);
  const rol = localStorage.getItem(KEY_ROL);
  return fullName ? { fullName, rol } : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);     // lazy init: lee localStorage 1 vez

  const login = (userData) => {                     // { fullName, rol }
    setUser(userData);
    localStorage.setItem(KEY_USUARIO, userData.fullName);
    localStorage.setItem(KEY_ROL, userData.rol);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY_USUARIO);
    localStorage.removeItem(KEY_ROL);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
```
`hooks/useAuth.js`:
```js
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return ctx;
}
```

## Paso 7 — LoginForm (equivale a `login.js`)

```jsx
export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();                      // ← sin esto recarga la página
    setError(null); setLoading(true);
    try {
      const usuario = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      login({ fullName: `${usuario.firstName} ${usuario.lastName}`, rol: usuario.rol });  // ← según lo que devuelva TU api
    } catch (err) {
      setError(err.status === 401 ? "Usuario o contraseña incorrectos"
             : err instanceof TypeError ? "No se pudo conectar con el servidor" : err.message);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```
**Qué devuelve `/api/login` en cada modelo** (mirá SIEMPRE `server.js` → `app.post("/api/login")`):

| Modelo | Respuesta OK | `login({...})` | Credenciales para probar |
|---|---|---|---|
| GameHub | usuario completo `{firstName,lastName,rol,...}` | `{fullName: first+last, rol}` | `alexg` / `alexgpass` |
| TrailerFlix | `{ ok:true, username }` | `{username}` | `emilys` / `emilyspass` |
| Eventos | `{ ok:true, firstName, lastName, rol, username }` | `{fullName, rol}` | `vipuser`/`vipuser123`, `admin`/`adminpassword` |

(Mala credencial → status **401** en los tres.)

> Variante: si la rúbrica dice "login() del AuthContext hace el fetch", mové el `apiFetch` adentro de `login(username, password)` en el Provider y que `LoginForm` solo haga `await login(...)` en un try/catch. Ambas valen.

## Paso 8 — Layout: el header cambia según haya sesión

```jsx
export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };
  return (
    <div>
      <header>
        <Link to="/">MI APP</Link>
        {user ? (
          <>
            <span>Bienvenido, {user.fullName} - {user.rol}</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <LoginForm />
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
```
(Eventos pide además un hook `useLogin`: sacá el estado+`handleSubmit` del `LoginForm` a `hooks/useLogin.js` → ver `soluciones/login/Eventos/`.)

---

## ✅ Checklist de verificación (tipo LOGIN)

1. [ ] `/` muestra el catálogo (con loading al principio). Con el server apagado muestra el error (no pantalla blanca).
2. [ ] Click en una card → URL `/algo/ID` y se ve el detalle. **Sin recargar la página** (no parpadea).
3. [ ] `/algo/99999` → "no encontrado". `/cualquiercosa` → 404.
4. [ ] Login con credenciales **malas** → mensaje de error, no se loguea.
5. [ ] Login **bueno** → desaparece el formulario, aparece "Bienvenido, ..." y botón cerrar sesión.
6. [ ] F5 → **sigue logueado** (F12 → Application → Local Storage: `usuario`/`rol`).
7. [ ] Cerrar sesión → vuelve el formulario y se borra el localStorage.
8. [ ] Imágenes se ven (TrailerFlix: ver [trampas](06-trampas-de-los-modelos.md#trailerflix-posters)).
9. [ ] `npm run build` OK.

## Qué cambiar para otro tema (nuevo parcial LOGIN)

| En la solución | Cambiar por |
|---|---|
| `API_BASE_URL` | puerto/prefijo del server nuevo |
| endpoints `/videojuegos`, `/contenido`, `/eventos` | los del `fetch` del `app.js` vanilla |
| campos en la Card/Detail | los de `retornoCard` / `evento.js` |
| rutas `/juegos/:id` etc. | las del README del examen |
| `login({...})` y claves de localStorage | lo que devuelve `/api/login` + lo que guarda `login.js` |
| agrupación por plataforma/género | solo si el vanilla agrupa; si no, un único `.map()` |
