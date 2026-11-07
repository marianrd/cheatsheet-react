# 02 · De vanilla a React: qué sacar de cada archivo y cómo convertirlo

## A. Mapa de archivos (de dónde sale cada componente)

| Archivo vanilla | Qué hace | Se convierte en… (React) |
|---|---|---|
| `index.html` → `<header>` | marca, nav, (login) | `components/Layout.jsx` o `Header.jsx` |
| `index.html` → `<form id="loginForm">` + `#userInfo` | formulario de login / "Bienvenido" | `components/LoginForm.jsx` + parte del `Layout` |
| `index.html` → `<select>`, `<input id="search">` (filtros) | filtros | `components/Filtros.jsx` |
| `index.html` → `<footer>` | pie | dentro de `Layout` |
| `js/app.js` → `fetch(URL)` + estado global (`let videojuegos`) | cargar catálogo | `hooks/useXxx.js` (useState+useEffect) |
| `js/app.js` → `retornoCard(...)` (template string) | HTML de 1 tarjeta | `components/XxxCard.jsx` |
| `js/app.js` → `retornoPlataforma/retornoGenero` | título de sección/agrupación | JSX dentro de `pages/HomePage.jsx` |
| `js/app.js` → `retornoError()` | mensaje de error | `if (error) return <...>` |
| `js/app.js` → `container.innerHTML = ...` | dibujar | el `return (...)` del componente |
| `movie.html / juego.html / evento.html` + `js/juego.js` | página de detalle | `pages/XxxDetailPage.jsx` |
| `URLSearchParams(location.search).get("id")` | leer id | `useParams()` |
| `js/login.js` | login/logout/localStorage | `context/AuthContext.jsx` + `hooks/useAuth.js` + `LoginForm.jsx` |
| `js/app.js` → `addToRecientes` / `js/clima.js` → `guardarEnHistorial` | guardar en localStorage | `context/XxxContext.jsx` (Provider) |
| `js/app.js` → `loadXxxRecientes` + sección "recientes" del HTML | página de recientes | `pages/Recientes.jsx` |
| `js/app.js` → `debounce` | retrasar búsqueda | `hooks/useDebounce.js` |
| `showPage()` / `.page.active` / `nav-btn` | "navegación" a mano | `<Routes>` + `<NavLink>` |
| `css/style.css` | estilos | `src/index.css` (ya viene; si no coincide, copiá el CSS vanilla y mantené los mismos `className`) |
| `server/*.js` | API | **no se toca**; solo leerlo para saber endpoints y formas |

---

## B. Tabla de conversión línea por línea

| Vanilla | React |
|---|---|
| `fetch(url).then(...)` suelto | dentro de `useEffect(() => {...}, [])` |
| `let datos;` global que se reasigna | `const [datos, setDatos] = useState(...)` |
| `container.innerHTML = html` | `return (<jsx/>)` |
| `` `...${x}...` `` en HTML | `{x}` en JSX |
| `arr.map(x => \`<li>${x}</li>\`).join("")` | `{arr.map(x => <li key={x}>{x}</li>)}` |
| `cond ? \`<div>..</div>\` : ""` | `{cond && <div>..</div>}` |
| `<a href="juego.html?id=${id}">` | `<Link to={`/juegos/${id}`}>` |
| `new URLSearchParams(location.search).get("id")` | `const { id } = useParams()` |
| `window.location.href = "clima.html?id=" + id` | `navigate(`/clima/${id}`)` con `const navigate = useNavigate()` |
| `<a href="index.html">Volver</a>` | `<Link to="/">Volver</Link>` |
| `document.getElementById("x").value` | estado controlado: `value={x} onChange={e => setX(e.target.value)}` |
| `form.addEventListener("submit", e => { e.preventDefault(); ... })` | `<form onSubmit={handle}>` con `e.preventDefault()` adentro |
| `btn.addEventListener("click", f)` | `<button onClick={f}>` |
| `el.style.display = "none"` / `"flex"` | render condicional `{cond && <X/>}` |
| `el.classList.add("active")` | `className={`x ${activo ? "active" : ""}`}` |
| `el.textContent = "..."` | `{variable}` en JSX |
| `document.addEventListener("DOMContentLoaded", init)` | `useEffect(init, [])` |
| `localStorage.getItem` al arrancar | `useState(() => leer())` (lazy init) |
| `localStorage.setItem` cada vez que cambia | `useEffect(() => { localStorage.setItem(...) }, [estado])` |
| `window.alert("error")` | `const [error, setError]` y `{error && <p>{error}</p>}` |
| `onclick="showDetalle('${id}')"` en HTML | `<Link to=...>` o `onClick={() => navigate(...)}` |
| `setTimeout` para debounce | `useDebounce(valor, 500)` |
| `img.onerror = ...` | `<img onError={...}/>` |
| `<iframe frameborder allowfullscreen>` | `<iframe frameBorder allowFullScreen>` |
| `for (let i=1;i<=20;i++) {...push}` | igual, pero **antes del return** (es JS normal) y luego `.map()` |

---

## C. Ejemplo completo en 3 pasos (card de GameHub)

**1. Vanilla** (`js/app.js`):
```js
const retornoCard = (juego, plataforma) => {
  const { id, nombre, desarrollador, año, genero, imagen, dlcs_incluidos } = juego
  const dlcPrincipal = dlcs_incluidos && dlcs_incluidos.length > 0 ? dlcs_incluidos[0] : null
  return `<div class="card">
    <a href="juego.html?id=${id}">
      <img src="${imagen}" alt="${nombre}">
      <h3 class="card-title">${nombre}</h3>
      ${dlcPrincipal ? `<p>${dlcPrincipal.nombre}</p>` : ''}
    </a></div>`
}
```

**2. Receta de conversión** (hacelo siempre igual):
1. `const retornoCard = (juego, plataforma) =>` → `export function GameCard({ game, platform })` (los parámetros pasan a ser **props**).
2. Copiar las líneas de destructuring/cálculo tal cual (es JS normal).
3. Cambiar `` return `...` `` por `return ( ... )` y pegar el HTML adentro.
4. En ese HTML: `class`→`className`, `${x}`→`{x}`, `<a href>`→`<Link to>`, cerrar `<img />`, `cond ? \`..\` : ''` → `{cond && (...)}`.

**3. React** (`components/GameCard.jsx`):
```jsx
import { Link } from "react-router-dom";

export function GameCard({ game, platform }) {
  const { id, nombre, desarrollador, año, genero, imagen, dlcs_incluidos } = game;
  const dlcPrincipal = dlcs_incluidos && dlcs_incluidos.length > 0 ? dlcs_incluidos[0] : null;
  return (
    <article className="card">
      <Link to={`/juegos/${id}`}>
        <img src={imagen} alt={nombre} />
        <h3 className="card-title">{nombre}</h3>
        {dlcPrincipal && <p>{dlcPrincipal.nombre}</p>}
      </Link>
    </article>
  );
}
```

---

## D. Agrupar por categoría (GameHub y TrailerFlix)

Vanilla armaba un string con `forEach`. En React: **filtrar y mapear**.

```jsx
// GameHub: la API ya viene agrupada  { PC:[..], Xbox:[..] }
{PLATFORMS.filter(p => data[p]?.length > 0).map(p => (
  <section key={p}><h2>{p}</h2>
    {data[p].map(j => <GameCard key={j.id} game={j} platform={p} />)}
  </section>
))}

// TrailerFlix: la API viene PLANA [..] y se agrupa por el campo `gen`
{GENEROS.map(gen => {
  const delGenero = contenido.filter(c => c.gen === gen);
  if (delGenero.length === 0) return null;          // oculta géneros vacíos
  return <article key={gen}><h2>{gen}</h2>{delGenero.map(...)}</article>;
})}
```

## E. Objetos con claves dinámicas → `Object.entries / Object.values`

JSON de países: `idiomas: { spa: "Español", eng: "Inglés" }`, `monedas: { ARS: { nombre, símbolo } }`.
```jsx
Object.values(pais.idiomas).join(", ")                 // "Español, Inglés"
Object.entries(pais.idiomas).map(([codigo, nombre]) => <li key={codigo}>{codigo}: {nombre}</li>)
```
Campos con **tilde** se acceden igual con punto: `pais.nombre.común`, `pais.región`, `pais.población`, `info.símbolo`, `juego.año`.
Usá `?.` para que no explote si falta: `pais.nombre?.común`.

## F. Datos "numerados" (Recetas: `strIngredient1..20`)

```jsx
const ingredientes = [];
for (let i = 1; i <= 20; i++) {
  const nombre = receta[`strIngredient${i}`];
  if (nombre && nombre.trim()) ingredientes.push({ nombre, medida: receta[`strMeasure${i}`] || "" });
}
// y luego: {ingredientes.map((ing, i) => <li key={i}>{ing.nombre} - {ing.medida}</li>)}
```
