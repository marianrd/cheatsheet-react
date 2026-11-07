# 📄 CHEATSHEET — Vanilla → React (1 hoja)

## Arranque
```bash
cd server && npm install && npm start        # API (mirá el PUERTO en server/*.js; TrailerFlix = 3001)
cd react  && npm install && npm run dev      # http://localhost:5173
curl http://localhost:3000/api/<endpoint>    # MIRAR la forma de la respuesta antes de codear
```
Orden: **API → api.js → hook/useEffect → Card → Home → Rutas → Detalle → Context → extras → `npm run build`**

## Conversión rápida
| Vanilla | React |
|---|---|
| `innerHTML = \`..${x}..\`` | `return (<..>{x}</..>)` |
| `class` / `for` / `onclick` | `className` / `htmlFor` / `onClick` |
| `arr.map(..).join('')` | `{arr.map(x => <X key={x.id} .../>)}` |
| `c ? \`<b/>\` : ''` | `{c && <b/>}` |
| `<a href="x.html?id=1">` | `<Link to={`/x/${id}`}>` |
| `location.search.get('id')` | `const { id } = useParams()` |
| `location.href = ...` | `const navigate = useNavigate(); navigate(...)` |
| `getElementById().value` | `value={s} onChange={e => setS(e.target.value)}` |
| `addEventListener('submit')` | `<form onSubmit={fn}>` + `e.preventDefault()` |
| `style.display='none'` | render condicional |
| `DOMContentLoaded` | `useEffect(fn, [])` |
| `localStorage` leer / escribir | `useState(() => leer())` / `useEffect(() => set(..), [estado])` |

## Plantilla de fetch (lista)
```jsx
const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(null);
useEffect(() => {
  let cancelled = false;
  apiFetch("/endpoint")
    .then(d => !cancelled && setData(d))
    .catch(e => !cancelled && setError(e))
    .finally(() => !cancelled && setLoading(false));
  return () => { cancelled = true; };
}, []);                                   // detalle: [id]  y setLoading(true)/setError(null) al inicio
if (loading) return <p>Cargando...</p>;
if (error)   return <p>{error.message}</p>;
if (!data || data.length === 0) return <p>Sin resultados</p>;
```
```js
// api/client.js
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, { headers: {"Content-Type":"application/json"}, ...options });
  let data = null; try { data = await res.json(); } catch {}
  if (!res.ok) { const e = new Error(data?.error || `Error ${res.status}`); e.status = res.status; throw e; }
  return data;
}
```

## Rutas
```jsx
// main.jsx: <BrowserRouter><Provider><App/></Provider></BrowserRouter>
<Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/items/:id" element={<Detail/>} />
  <Route path="/recientes" element={<Recientes/>} />
  <Route path="*" element={<NotFound/>} />
</Routes>
```

## Context + hook (molde)
```jsx
export const XContext = createContext(null);
export function XProvider({ children }) {
  const [x, setX] = useState(leerStorage);                       // lazy init
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(x)), [x]);   // persistir
  const accion = useCallback((a) => setX(prev => /* nuevo */), []);
  return <XContext.Provider value={{ x, accion }}>{children}</XContext.Provider>;
}
export const useX = () => { const c = useContext(XContext); if (!c) throw new Error("fuera del Provider"); return c; };
```

### LOGIN
```jsx
// AuthContext: user = leerSesion() ; login(u){ setUser(u); localStorage.setItem("usuario", u.fullName); ... } ; logout(){ setUser(null); removeItem... }
// LoginForm onSubmit:
e.preventDefault();
const u = await apiFetch("/login", { method:"POST", body: JSON.stringify({ username, password }) });
login({ fullName: `${u.firstName} ${u.lastName}`, rol: u.rol });       // según lo que responda TU /api/login
// catch: err.status === 401 → "Usuario o contraseña incorrectos"
// Layout: {user ? <>Bienvenido, {user.fullName}<button onClick={logout}>Cerrar sesión</button></> : <LoginForm/>}
```
Credenciales: GameHub `alexg/alexgpass` · TrailerFlix `emilys/emilyspass` · Eventos `vipuser/vipuser123`, `admin/adminpassword`

### HISTORIAL
```jsx
// sin duplicados + más nuevo primero + límite:
setRecientes(prev => [id, ...prev.filter(r => r !== id)].slice(0, 15));
// (Clima) push al final con dedupe por id:
setHistorial(prev => prev.some(c => c.id === id) ? prev : [...prev, { id, ciudad, fecha: new Date().toLocaleString() }]);
// agregar al historial: en el useEffect del DETALLE, cuando llegó el dato:  agregar(data.id)
// Recientes: Promise.allSettled(ids.map(getX)).then(r => r.filter(x => x.status==="fulfilled").map(x => x.value))
```
Debounce: `useDebounce(valor, 500)` (setTimeout + `return () => clearTimeout`). Query string a la API: `new URLSearchParams({...}).toString()`.

## Trampas top
1. **Export ≠ import** (`GameDetailPage` vs `PeliculaDetailPage` en los esqueletos) → no compila.
2. Falta `BrowserRouter` / `Provider` en `main.jsx` → pantalla blanca.
3. Respuesta **envuelta** (`data.paises`, `data.ciudades`) o **agrupada** (`{PC:[..]}`).
4. TrailerFlix: puerto **3001** + `posterUrl()`. Clima: ids repetidos → `key={index}`.
5. `fetch` no falla en 404 → `if (!res.ok) throw`.
6. `useEffect` sin `[]` / con objeto en deps → bucle infinito.
7. `if (loading) return` antes de los filtros → el input pierde foco.
8. Campos con tilde: `nombre.común`, `región`, `población`, `año`.
9. `key` única en cada `.map`. `e.preventDefault()` en cada form.
10. Prohibido: `document.getElementById`, `innerHTML`, `window.location`, `<a href="x.html">`.

## Chequeo final
`npm run build` ✔ · consola F12 limpia ✔ · home→detalle→404 ✔ · (login malo/bueno/F5/logout | historial sin duplicar/F5/limpiar) ✔ · rúbrica punto por punto ✔
