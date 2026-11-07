# 04 · Tipo HISTORIAL (Clima · Paises · Recetas)

**Piezas:** `App.jsx` (Router + Provider + Routes) · `services/api.js` · `Context` del historial + hook `useXxx` · `Home` (selector o filtros) · `Detail` (**agrega al historial**) · `Recientes` (lista el historial) · `Loading`/`ErrorMessage`/`NotFound`.

Soluciones completas y probadas: `soluciones/historial/{Clima,Paises,Recetas}/src/`.

> ⚠️ **Primero leé el vanilla**: cada modelo guarda el historial *distinto*:
>
> | | Clave localStorage | Qué guarda | Orden | Límite |
> |---|---|---|---|---|
> | Clima | `historialConsultas` | objetos `{id, ciudad, fecha}` | `push` (al final) | sin límite |
> | Paises | `paisesRecientes` | solo códigos `"ARG"` | `unshift` (primero el nuevo) | 15 |
> | Recetas | `recetasRecientes` | solo ids `"53262"` | `unshift` | 15 |
>
> Todos: **sin duplicados**. Replicá lo que haga el vanilla (`guardarEnHistorial` / `addToRecientes`).

---

## Paso 1 — `App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <PaisesRecientesProvider>          {/* el Provider envuelve TODO lo que use el historial */}
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pais/:cca3" element={<PaisDetail />} />   {/* ← ruta del README */}
            <Route path="/recientes" element={<Recientes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </PaisesRecientesProvider>
    </BrowserRouter>
  );
}
```
(Clima ya trae esto armado; Paises tiene `App` vacío → tenés que hacerlo.)

## Paso 2 — `services/api.js`

```js
const API_BASE = "http://localhost:3000/api";

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {                                  // fetch NO falla solo con 404/500
    const err = new Error(response.status === 404 ? "No encontrado" : `Error ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return response.json();
}

// La API responde envuelto: { success, paises: [...] }  → devolvemos data.paises
export async function getPaises(filtros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => { if (v) params.set(k, v); });   // omite vacíos
  const q = params.toString();
  const data = await request(`/paises${q ? `?${q}` : ""}`);
  return data.paises;
}
export async function getPais(cca3) { return (await request(`/paises/${cca3}`)).pais; }
```
> ⚠️ Mirá la forma de la respuesta con `curl`: Clima → `{ciudades:[]}` · Paises → `{success,paises}` · Recetas → `{success,recetas}`; detalle → `{pais}` / `{receta}` / ciudad **sin envolver**.

## Paso 3 — EL CONTEXT del historial (lo que más puntos vale: 25)

```jsx
import { createContext, useState, useEffect, useCallback } from "react";

export const PaisesRecientesContext = createContext();

const STORAGE_KEY = "paisesRecientes";     // ← la MISMA clave que el vanilla
const MAX = 15;

function leer() {                          // se ejecuta 1 vez (lazy init)
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

export function PaisesRecientesProvider({ children }) {
  const [recientes, setRecientes] = useState(leer);

  // Persistir: cada vez que cambia el estado, se guarda
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recientes));
  }, [recientes]);

  // sacar si ya estaba → poner primero → recortar a MAX   (sin duplicados, sin crecer infinito)
  const agregarPaisReciente = useCallback((cca3) => {
    setRecientes((prev) => [cca3, ...prev.filter((c) => c !== cca3)].slice(0, MAX));
  }, []);

  const limpiarRecientes = useCallback(() => setRecientes([]), []);

  return (
    <PaisesRecientesContext.Provider value={{ recientes, agregarPaisReciente, limpiarRecientes }}>
      {children}
    </PaisesRecientesContext.Provider>
  );
}
```
**Variante Clima** (objetos, push al final, dedupe por `id`):
```jsx
const agregarConsulta = useCallback((id, nombre) => {
  setHistorial((prev) => {
    if (prev.some((c) => c.id === id)) return prev;                     // ya está → no cambia nada
    return [...prev, { id, ciudad: nombre, fecha: new Date().toLocaleString() }];
  });
}, []);
```
Hook (los esqueletos ya lo traen hecho):
```js
export function usePaisesRecientes() {
  const ctx = useContext(PaisesRecientesContext);
  if (!ctx) throw new Error("usePaisesRecientes debe usarse dentro de PaisesRecientesProvider");
  return ctx;
}
```
**Por qué `useCallback` + `setX(prev => ...)`:** la función no cambia entre renders, así podés ponerla en el `[deps]` de un `useEffect` **sin bucle infinito**, y con el modo estricto (que ejecuta efectos 2 veces en desarrollo) el historial igual no se duplica.

## Paso 4 — `Home`

### 4a. Selector que se llena desde la API (Clima)
```jsx
const [ciudades, setCiudades] = useState([]);
const [seleccion, setSeleccion] = useState("0");        // índice elegido
useEffect(() => { getCiudades().then(setCiudades).catch(...); }, []);

const handleSubmit = (e) => {
  e.preventDefault();
  navigate(`/clima/${ciudades[Number(seleccion)].id}`);   // useNavigate, no window.location
};
<select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
  {ciudades.map((c, i) => <option key={i} value={i}>{c.nombre}</option>)}
</select>
```
(El `key={i}` y el índice como value son a propósito: ver trampa de ids repetidos en Clima.)

### 4b. Filtros + búsqueda con debounce (Paises / Recetas)
```jsx
const [filtros, setFiltros] = useState({ continente: "", idioma: "", buscar: "" });
const buscarDebounced = useDebounce(filtros.buscar, 500);

useEffect(() => {
  let cancelled = false;
  setLoading(true); setError(null);
  getPaises({ continente: filtros.continente, idioma: filtros.idioma, buscar: buscarDebounced })
    .then((d) => { if (!cancelled) setPaises(d); })
    .catch(() => { if (!cancelled) setError("Error al cargar"); })
    .finally(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, [filtros.continente, filtros.idioma, buscarDebounced]);   // ← primitivos, NO el objeto filtros
```
`hooks/useDebounce.js`:
```js
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);          // cancela el timer anterior en cada tecla
  }, [value, delay]);
  return debounced;
}
```
Render — ojo: **los filtros siempre visibles**, solo la lista cambia:
```jsx
<Filtros filtros={filtros} onFilterChange={setFiltros} />
{loading && <Loading />}
{error && <ErrorMessage message={error} />}
{!loading && !error && paises.length === 0 && <p>No se encontraron países.</p>}
{!loading && !error && <div className="paises-grid">{paises.map(p => <PaisCard key={p.cca3} pais={p} />)}</div>}
```
(Si hacés `if (loading) return <Loading/>` los filtros desaparecen y el input pierde el foco al escribir.)

### 4c. (Recetas) filtros en la query string de la URL
La rúbrica dice *"pasados a las Query Strings de la URL"*. Versión completa en `soluciones/historial/Recetas/src/pages/HomePage.jsx` usando `useSearchParams`: la URL es la fuente de verdad (`/?categoria=Beef&buscar=adana`), el fetch depende de esos valores, y al volver del detalle los filtros se conservan.
Versión mínima aceptable: `getRecetas({categoria, area, buscar})` con `URLSearchParams` como arriba (eso ya arma la query string hacia la API).

## Paso 5 — `Detail`: acá se alimenta el historial

```jsx
const { cca3 } = useParams();
const { agregarPaisReciente } = usePaisesRecientes();

useEffect(() => {
  let cancelled = false;
  setLoading(true); setError(null); setPais(null);
  getPais(cca3)
    .then((data) => {
      if (cancelled) return;
      setPais(data);
      agregarPaisReciente(data.cca3);                  // ← guardar en el historial
    })
    .catch((err) => { if (!cancelled) setError(err.status === 404 ? "País no encontrado." : "Error"); })
    .finally(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, [cca3, agregarPaisReciente]);
```
Render con `{loading && ...} {error && ...} {pais && (...)}`. Para objetos con claves dinámicas ver [02 §E](02-de-vanilla-a-react.md).

## Paso 6 — `Recientes`

En localStorage solo hay **ids**, así que se piden al API en paralelo y se muestran las cards:
```jsx
const { recientes, limpiarRecientes } = usePaisesRecientes();
const [paises, setPaises] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;
  if (recientes.length === 0) { setPaises([]); setLoading(false); return; }
  setLoading(true);
  Promise.allSettled(recientes.map((cca3) => getPais(cca3))).then((res) => {   // allSettled: un fallo no rompe el resto
    if (cancelled) return;
    setPaises(res.filter((r) => r.status === "fulfilled").map((r) => r.value));
    setLoading(false);
  });
  return () => { cancelled = true; };
}, [recientes]);
```
+ `{paises.length === 0 && <p>No has visto ningún país aún.</p>}` + botón `onClick={limpiarRecientes}`.
(Clima: el historial ya guarda `{id, ciudad, fecha}`, no hace falta pedir nada: solo `historial.map(c => <li><Link to={`/clima/${c.id}`}>…)`.)

---

## ✅ Checklist de verificación (tipo HISTORIAL)

1. [ ] `/` carga la lista/selector desde la API (con loading y error).
2. [ ] Cambiar filtros / escribir en el buscador actualiza la lista; buscar algo inexistente → mensaje "no se encontraron".
3. [ ] Escribir rápido en el buscador dispara **una** request (F12 → Network), no una por letra.
4. [ ] Click/selección → detalle `/algo/ID` con datos correctos, sin recargar.
5. [ ] F12 → Application → Local Storage: aparece la **clave del vanilla** con el valor esperado.
6. [ ] Entrar **dos veces** al mismo ítem → **no se duplica**. Entrar a otro → se agrega en el orden correcto.
7. [ ] F5 en `/recientes` → el historial **sigue** ahí.
8. [ ] "Limpiar" vacía lista y localStorage (`[]`).
9. [ ] ID inexistente (`/pais/XXX`) → mensaje, no pantalla blanca. `/loquesea` → 404.
10. [ ] `npm run build` OK.

## Qué cambiar para otro tema (nuevo parcial HISTORIAL)

| En la solución | Cambiar por |
|---|---|
| nombre del Context/hook/clave | tema nuevo + **clave exacta del vanilla** |
| campo ID (`cca3`, `idMeal`, `id`) | el que use el `addToRecientes` vanilla |
| `data.paises` / `data.recetas` / `data.ciudades` | la envoltura real de la API |
| filtros (continente/idioma ↔ categoría/area) | los `<select>` del `index.html` vanilla y los `req.query.*` del server |
| orden/límite | lo que haga el vanilla (`push` vs `unshift`, `slice`) |
