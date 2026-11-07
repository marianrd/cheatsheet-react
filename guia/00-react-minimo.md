# 00 · React mínimo (lo único que necesitás para este parcial)

Si ya lo sabés, saltealo. Todo lo demás de React **no se evalúa** en estos parciales.

## 1. Componente = función que devuelve JSX

```jsx
function Saludo({ nombre }) {          // {nombre} = "props" (parámetros que le pasa el padre)
  return <h1>Hola {nombre}</h1>;       // {...} dentro del JSX = código JavaScript
}
// uso:  <Saludo nombre="Ana" />
```

Reglas de JSX (los errores clásicos al pasar de HTML):

| HTML | JSX |
|---|---|
| `class="x"` | `className="x"` |
| `for="id"` | `htmlFor="id"` |
| `<img>` `<input>` `<br>` | `<img />` `<input />` `<br />` (siempre se cierran) |
| `style="color:red"` | `style={{ color: "red" }}` (doble llave) |
| `onclick="f()"` | `onClick={f}` |
| `frameborder`, `allowfullscreen` | `frameBorder`, `allowFullScreen` |
| `<!-- comentario -->` | `{/* comentario */}` |
| devolver 2 elementos hermanos | envolver en `<>...</>` |

## 2. `useState` — datos que cambian y re-dibujan

```jsx
const [count, setCount] = useState(0);   // [valor, función para cambiarlo]
setCount(count + 1);                    // NUNCA count = count + 1
```
- Arrays/objetos: **crear uno nuevo**: `setLista([...lista, nuevo])`, `setObj({ ...obj, campo: 1 })`.
- Si el nuevo valor depende del anterior, usá la forma función: `setLista(prev => [...prev, nuevo])`.
- Valor inicial "caro" (leer localStorage): `useState(() => leer())` (función, se ejecuta 1 sola vez).

## 3. `useEffect` — "hacer algo" cuando el componente aparece o cambia algo

```jsx
useEffect(() => {
  // código (acá va el fetch)
  return () => { /* limpieza opcional */ };
}, [a, b]);        // ← array de dependencias
```
| Dependencias | Cuándo corre |
|---|---|
| `[]` | una sola vez, al montarse (≈ `DOMContentLoaded`) |
| `[id]` | al montarse y cada vez que cambia `id` |
| *(sin array)* | en CADA render → **bucle infinito si hacés setState dentro** ❌ |

Regla: **todo lo que uses adentro y venga de afuera (props, state, params) va en el array**.

## 4. El patrón de fetch (lo vas a escribir 5 veces)

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  let cancelled = false;                 // evita tocar estado si ya te fuiste de la página
  fetch("http://localhost:3000/api/algo")
    .then((r) => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json(); })
    .then((d) => { if (!cancelled) setData(d); })
    .catch((e) => { if (!cancelled) setError(e); })
    .finally(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, []);

if (loading) return <p>Cargando...</p>;
if (error)   return <p>Error: {error.message}</p>;
return <ul>{data.map((x) => <li key={x.id}>{x.nombre}</li>)}</ul>;
```
⚠️ `fetch` **no falla en 404/500**: hay que mirar `response.ok` (por eso el `if (!r.ok) throw`).

## 5. Dibujar listas y condiciones

```jsx
{items.map((it) => <Card key={it.id} item={it} />)}   // key única SIEMPRE
{cond && <Algo />}                                    // mostrar si cond es true
{cond ? <A /> : <B />}                                // uno u otro
{lista.length === 0 && <p>Sin resultados</p>}
```
`{x && ...}` con `x = 0` pinta un "0". Usá `x > 0 && ...`.

## 6. React Router (v6)

```jsx
// main.jsx
<BrowserRouter><App /></BrowserRouter>

// App.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/juegos/:id" element={<Detalle />} />   {/* :id = parámetro */}
  <Route path="*" element={<NotFound />} />            {/* cualquier otra = 404 */}
</Routes>

// en cualquier componente
<Link to="/juegos/3">Ver</Link>            // reemplaza <a href>
<NavLink to="/" end>Inicio</NavLink>       // Link que sabe si está activo
const { id } = useParams();                // lee :id (siempre STRING)
const navigate = useNavigate(); navigate("/"); // reemplaza window.location.href
const [sp, setSp] = useSearchParams();     // ?clave=valor
```

## 7. Formularios controlados (reemplazan `getElementById(...).value`)

```jsx
const [user, setUser] = useState("");
<input value={user} onChange={(e) => setUser(e.target.value)} />

const onSubmit = (e) => { e.preventDefault(); /* usar user */ };
<form onSubmit={onSubmit}> ... <button type="submit">Enviar</button></form>
```

## 8. Context — estado global sin pasar props por todos lados

```jsx
// 1) crear
export const MiContext = createContext(null);
// 2) Provider: guarda el estado y lo expone
export function MiProvider({ children }) {
  const [x, setX] = useState(0);
  return <MiContext.Provider value={{ x, setX }}>{children}</MiContext.Provider>;
}
// 3) envolver la app:  <MiProvider><App/></MiProvider>
// 4) consumir en cualquier componente hijo:
const { x, setX } = useContext(MiContext);
```
Un **custom hook** es solo una función que empieza con `use` y usa otros hooks. Ej: `useAuth = () => useContext(AuthContext)`.

## 9. localStorage

```js
localStorage.setItem("clave", JSON.stringify(objeto));   // guardar (solo strings → JSON.stringify)
JSON.parse(localStorage.getItem("clave")) || [];          // leer (puede ser null)
localStorage.removeItem("clave");
```
Ver lo guardado: F12 → pestaña **Application** → Local Storage.
