# 00 · EMPEZAR ACÁ — paso a paso, desde el esqueleto vacío (sin scripts)

Ejemplo guiado con **Clima** (el que te trabó), pero cada paso tiene su **molde genérico** con `MAYÚSCULAS` para reemplazar.
Regla de oro: **un paso a la vez, y no pasás al siguiente hasta ver el ✅.**

Vocabulario mínimo:
- **API** = el server (`npm start` en `server/`). Te responde datos en JSON a cambio de una URL.
- **fetch** = la función de JavaScript que pide esa URL.
- **estado (`useState`)** = una variable de React; cuando cambia, la pantalla se redibuja.
- **useEffect** = "ejecutá esto cuando la pantalla aparece" (acá van los fetch).

---

## PASO 0 — Tener las dos cosas prendidas

Terminal 1: `cd server` → `npm install` → `npm start` (dejala abierta).
Terminal 2: `cd react` → `npm install` → `npm run dev` (dejala abierta) → abrí la URL que muestra (`http://localhost:5173`).

✅ Terminal 1 dice "corriendo en http://localhost:3000". Terminal 2 dice "Local: http://localhost:5173".

---

## PASO 1 — Ver qué devuelve la API (todavía NO escribas código)

1. Abrí `server/mockServer.js` (o `server.js`) y buscá las líneas `app.get(`. Cada una es una URL disponible:
   ```js
   app.get("/api/ciudades", ...)        →  http://localhost:3000/api/ciudades
   app.get("/api/ciudades/:id", ...)    →  http://localhost:3000/api/ciudades/1
   ```
   (El `:id` es un comodín: se reemplaza por un número.)
2. **Pegá esa URL en el navegador** y mirá qué sale.

Clima muestra esto:
```json
{ "ciudades": [ { "id": 1, "nombre": "Buenos Aires", "temperatura": 20, "humedad": 60, "condicion": "Mayormente soleado" }, ... ] }
```
3. Anotá **3 cosas** (esto es lo que te traba si no lo mirás):

| Pregunta | En Clima |
|---|---|
| ¿Empieza con `[` (lista) o con `{` (objeto)? | `{` → **objeto** |
| Si es objeto: ¿en qué clave está la lista? | `ciudades` → los datos están en **`data.ciudades`**, no en `data` |
| ¿Cómo se llaman los campos? (copiá exacto) | `id`, `nombre`, `temperatura`, `humedad`, `condicion` |

✅ Tenés anotado: la URL, si es `[` o `{`, la clave de la lista y los nombres de los campos.

---

## PASO 2 — Probar el fetch en la consola del navegador (sin tocar el proyecto)

En el navegador: **F12 → pestaña Console**, pegá y Enter:
```js
fetch("http://localhost:3000/api/ciudades").then(r => r.json()).then(console.log)
```
(Molde: `fetch("URL_DE_LA_API").then(r => r.json()).then(console.log)`)

✅ Aparece el objeto con los datos. → La API anda y la URL está bien.
❌ `Failed to fetch` → el server (terminal 1) está apagado o el puerto es otro.
❌ `404` → la URL está mal escrita (compará con `app.get(` del server).

> Leelo así: **fetch(url)** pide → `.then(r => r.json())` convierte la respuesta a objeto → `.then(console.log)` lo muestra.

---

## PASO 3 — La función que pide los datos (`src/services/api.js`)

El esqueleto trae esto vacío:
```js
const API_BASE = "http://localhost:3000/api";

export async function getCiudades() {
  try {
  } catch (error) {
    console.error("Error al cargar ciudades:", error);
    throw error;
  }
}
```
**Completá el `try { }`** con 4 líneas:
```js
export async function getCiudades() {
  try {
    const response = await fetch(`${API_BASE}/ciudades`);          // 1. pedir
    if (!response.ok) throw new Error(`Error ${response.status}`); // 2. si el server dijo error (404/500), avisar
    const data = await response.json();                            // 3. convertir a objeto
    return data.ciudades;                                          // 4. devolver SOLO la lista (por eso "ciudades")
  } catch (error) {
    console.error("Error al cargar ciudades:", error);
    throw error;
  }
}
```
Qué hace cada cosa:
- `async` / `await` = "esperá a que llegue la respuesta antes de seguir". `await` solo se puede usar dentro de una función `async`.
- Las **comillas raras** `` ` `` (backticks) permiten meter variables con `${...}`.
- `response.ok` es `false` si el server respondió 404/500. `fetch` **no** da error solo en esos casos: hay que mirarlo.

**Molde genérico:**
```js
export async function getITEMS() {
  try {
    const response = await fetch(`${API_BASE}/RECURSO`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    return data.CLAVE_DE_LA_LISTA;        // si la API devuelve [ ... ] directo: return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
```
**Para el detalle (un solo ítem):**
```js
export async function getCiudad(id) {
  try {
    const response = await fetch(`${API_BASE}/ciudades/${id}`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();         // Clima devuelve el objeto suelto. Paises: data.pais · Recetas: data.receta
  } catch (error) {
    console.error("Error al cargar ciudad:", error);
    throw error;
  }
}
```
✅ **Checkpoint:** todavía no se ve nada en pantalla (falta usarla). Seguí.

---

## PASO 4 — Usarla en un componente (`src/pages/Home.jsx`) ← acá se traba todo el mundo

Acá aprendés el patrón de **3 estados**: los datos, "estoy cargando", "hubo error".

```jsx
import { useState, useEffect } from "react";
import { getCiudades } from "../services/api";      // ← importar la función del paso 3

function Home() {
  const [ciudades, setCiudades] = useState([]);     // los datos (empieza vacío)
  const [loading, setLoading] = useState(true);     // ¿está cargando?
  const [error, setError] = useState(null);         // ¿falló?

  useEffect(() => {
    getCiudades()
      .then((data) => setCiudades(data))            // llegaron: guardarlos
      .catch((err) => setError(err.message))        // falló: guardar el mensaje
      .finally(() => setLoading(false));            // pase lo que pase: ya no está cargando
  }, []);                                           // [] = "una sola vez, al aparecer la pantalla"

  console.log("ciudades:", ciudades);               // ← TEMPORAL, para ver que llegan

  return ( /* ...lo que ya tenía el esqueleto... */ );
}
```
Reglas que evitan los errores típicos:
- ❌ **No** escribas `useEffect(async () => {...})` (React no lo permite). Usá `.then(...)` como arriba.
- ❌ **No** olvides el `[]` al final del `useEffect` (sin él, pide datos infinitamente).
- ❌ **No** modifiques el estado con `ciudades = ...`; siempre con `setCiudades(...)`.

**Molde genérico:** copiá y reemplazá `ITEMS` / `getITEMS`:
```jsx
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  getITEMS().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
}, []);
```

✅ **Checkpoint:** F12 → Console. Ves `ciudades: (8) [{…}, {…}, ...]` (primero `[]` vacío y enseguida los datos; el doble es normal).
❌ Ves `ciudades: []` siempre → mirá la pestaña **Network** (F12): ¿salió la request? ¿qué status tiene? Casi siempre es `data.ciudades` mal escrito (paso 1) o el server apagado.
❌ Pantalla blanca → leé el error rojo de la consola; suele ser un import mal escrito (`../services/api` — nombre de archivo exacto).

---

## PASO 5 — Dibujar los datos (JSX)

Dentro del `return`, mostrá los 3 casos **antes** de la pantalla normal:
```jsx
if (loading) return <p>Cargando...</p>;
if (error) return <p>Error: {error}</p>;

const [seleccion, setSeleccion] = useState("0");   // (junto a los otros useState) qué opción está elegida

return (
  <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
    {ciudades.map((ciudad, i) => (
      <option key={i} value={i}>{ciudad.nombre}</option>
    ))}
  </select>
);
```
(El `<select>` "controlado": `value` muestra lo elegido y `onChange` lo actualiza. Usamos la posición `i` como valor porque en los datos de Clima hay ids repetidos.)
- `{ ... }` dentro del JSX = "acá va JavaScript".
- `.map()` convierte cada elemento de la lista en un pedacito de pantalla. **Siempre** con `key` (un valor único por elemento).
- Los nombres (`ciudad.nombre`) son los **campos que anotaste en el paso 1**, escritos idénticos.

**Molde genérico (lista de tarjetas):**
```jsx
{items.length === 0 && <p>No hay resultados</p>}
{items.map((item) => (
  <div key={item.ID}>
    <h3>{item.CAMPO_TITULO}</h3>
    <p>{item.CAMPO_2}</p>
  </div>
))}
```
✅ **Checkpoint:** en pantalla ves las ciudades en el select / la lista.

---

## PASO 6 — Rutas y página de detalle

**6a. Las rutas** (`src/App.jsx`; Clima ya las trae, otros esqueletos no):
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/clima/:id" element={<ClimaDetail />} />   {/* :id = parte variable de la URL */}
    <Route path="*" element={<NotFound />} />                {/* cualquier otra = 404 */}
  </Routes>
</BrowserRouter>
```
**6b. Ir al detalle** desde Home (al enviar el formulario):
```jsx
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();                     // arriba, dentro del componente

const handleSubmit = (e) => {
  e.preventDefault();                               // ← sin esto la página se recarga
  navigate(`/clima/${ciudades[Number(seleccion)].id}`);
};
<form onSubmit={handleSubmit}> ... </form>
```
Para una tarjeta/lista usás `<Link to={`/clima/${item.id}`}>texto</Link>` (importar `Link` de `react-router-dom`).

**6c. El detalle** (`ClimaDetail.jsx`): igual que el paso 4 pero con el `id` de la URL:
```jsx
import { useParams } from "react-router-dom";
const { id } = useParams();                          // el :id de la ruta (siempre texto)

const [ciudad, setCiudad] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true); setError(null);
  getCiudad(id)
    .then(setCiudad)
    .catch(() => setError("La ciudad no existe."))
    .finally(() => setLoading(false));
}, [id]);                                             // [id] = "volvé a pedir si cambia el id"

if (loading) return <p>Cargando...</p>;
if (error) return <p>{error}</p>;
return <p>{ciudad.nombre}: {ciudad.temperatura} °C</p>;
```
✅ **Checkpoint:** elegís algo en Home → la URL cambia a `/clima/2` → se ve el detalle sin recargar. `/clima/999` → mensaje de error. `/loquesea` → 404.

---

## PASO 7 — El historial (Context + localStorage)

Un **Context** es un "estado compartido" que cualquier pantalla puede leer. Son 3 piezas.

**7a. El archivo** `src/context/HistorialConsultasContext.jsx` (copiá todo, cambiá lo marcado):
```jsx
import { createContext, useState, useEffect, useCallback } from "react";

export const HistorialConsultasContext = createContext();

const STORAGE_KEY = "historialConsultas";            // ← CAMBIAR por la clave del vanilla (buscá localStorage.setItem en js/)

function leerHistorial() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

export function HistorialConsultasProvider({ children }) {
  const [historial, setHistorial] = useState(leerHistorial);     // arranca con lo guardado

  useEffect(() => {                                              // cada vez que cambia, se guarda
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  }, [historial]);

  const agregarConsulta = useCallback((id, nombre) => {
    setHistorial((prev) => {
      if (prev.some((c) => c.id === id)) return prev;            // ya está: no duplicar
      return [...prev, { id, ciudad: nombre, fecha: new Date().toLocaleString() }];
    });
  }, []);

  const limpiarHistorial = useCallback(() => setHistorial([]), []);

  return (
    <HistorialConsultasContext.Provider value={{ historial, agregarConsulta, limpiarHistorial }}>
      {children}
    </HistorialConsultasContext.Provider>
  );
}
```
**7b. Envolver la app:** el `<HistorialConsultasProvider>` tiene que estar **por fuera** de las pantallas que lo usan (Clima ya lo trae en `App.jsx`; si no, envolvé el `<BrowserRouter>` con él).

**7c. Usarlo** en cualquier pantalla (el hook `useHistorialConsultas` ya viene hecho en el esqueleto):
```jsx
import { useHistorialConsultas } from "../hooks/useHistorialConsultas";
const { historial, agregarConsulta, limpiarHistorial } = useHistorialConsultas();
```
En el **detalle**, cuando llegan los datos, se agrega:
```jsx
getCiudad(id).then((data) => {
  setCiudad(data);
  agregarConsulta(data.id, data.nombre);             // ← acá se alimenta el historial
})
```
(y agregá `agregarConsulta` al `[id]` del useEffect: `[id, agregarConsulta]`.)

**Mostrar el historial** (en Home / Recientes):
```jsx
{historial.length === 0 && <p>Todavía no consultaste nada.</p>}
<ul>
  {historial.map((c) => (
    <li key={c.id}><Link to={`/clima/${c.id}`}>{c.ciudad} - {c.fecha}</Link></li>
  ))}
</ul>
<button onClick={limpiarHistorial}>Limpiar</button>
```
✅ **Checkpoint:** F12 → **Application** → Local Storage → `localhost:5173`: aparece tu clave con los datos. Entrás dos veces al mismo ítem → **no** se repite. F5 → sigue ahí. Limpiar → `[]`.

**Variante "recientes" (Paises/Recetas):** guarda solo ids, el nuevo primero, máximo 15:
```jsx
const agregarReciente = useCallback((id) => {
  setRecientes((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, 15));
}, []);
```
Cuál usar (`push` vs nuevo primero, límite, qué se guarda) → **copiá lo que haga el vanilla** (`js/app.js`, buscá `localStorage`).

---

## PASO 8 — Chequeo final

`npm run build` sin errores · F12 Console sin rojos · lista → detalle → 404 → historial/F5 → limpiar · `rubricas.md` punto por punto.
(Detalle en [`05-verificar-y-debug.md`](05-verificar-y-debug.md).)

---

# 🔐 Si el parcial es de LOGIN en vez de historial

Los pasos 0–6 son **idénticos** (lista + detalle). Cambia el paso 7:

**L1. Entender el login del vanilla** (`js/login.js`): ¿a qué URL hace POST? ¿qué le manda? ¿qué guarda en localStorage? Probalo en la consola del navegador (F12) cambiando usuario/clave por unos válidos de `data/usuarios.json`:
```js
fetch("http://localhost:3000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "USUARIO", password: "CLAVE" })
}).then(r => r.json()).then(console.log)
```
Anotá qué campos devuelve (`firstName`, `rol`, `username`...). Con clave mala devuelve error **401**.

**L2. El POST en React**, línea por línea:
```js
const response = await fetch(`${API_BASE}/login`, {
  method: "POST",                                         // por defecto es GET; acá enviamos datos
  headers: { "Content-Type": "application/json" },        // "te mando JSON"
  body: JSON.stringify({ username, password }),           // los datos, convertidos a texto
});
if (response.status === 401) throw new Error("Usuario o contraseña incorrectos");
if (!response.ok) throw new Error(`Error ${response.status}`);
const usuario = await response.json();
```

**L3. El formulario controlado** (cada input guarda lo que escribís en un estado):
```jsx
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  try {
    /* ...el POST de L2... */
    login({ nombre: usuario.firstName, rol: usuario.rol });   // ← guarda en el Context
  } catch (err) {
    setError(err.message);
  }
};

<form onSubmit={handleSubmit}>
  <input value={username} onChange={(e) => setUsername(e.target.value)} />
  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
  <button type="submit">Ingresar</button>
  {error && <p>{error}</p>}
</form>
```
**L4. El Context de sesión** (mismo molde que el paso 7a, pero guarda `user`):
```jsx
const [user, setUser] = useState(() => {                       // lee la sesión guardada
  const nombre = localStorage.getItem("usuario");              // ← claves de js/login.js
  return nombre ? { nombre, rol: localStorage.getItem("rol") } : null;
});
const login = (u) => { setUser(u); localStorage.setItem("usuario", u.nombre); localStorage.setItem("rol", u.rol); };
const logout = () => { setUser(null); localStorage.removeItem("usuario"); localStorage.removeItem("rol"); };
// value={{ user, login, logout }}
```
**L5. Mostrar según haya sesión** (header):
```jsx
{user ? (<><span>Bienvenido, {user.nombre}</span><button onClick={logout}>Cerrar sesión</button></>) : (<LoginForm />)}
```
✅ **Checkpoint:** clave mala → error · clave buena → "Bienvenido" · F5 → sigue · cerrar sesión → vuelve el form.
Versión completa y probada: [`03-tipo-login.md`](03-tipo-login.md).

---

# 🔁 CÓMO ADAPTAR a un tema nuevo (tabla de equivalencias)

Lo que en Clima se llama de una forma, en tu parcial se llamará de otra. Las **piezas son las mismas**:

| Pieza genérica | Clima | Paises | Recetas | Tu parcial (completá) |
|---|---|---|---|---|
| Endpoint de la lista | `/ciudades` | `/paises` | `/recetas` | |
| Clave donde viene la lista | `data.ciudades` | `data.paises` | `data.recetas` | |
| Endpoint del detalle | `/ciudades/:id` | `/paises/:cca3` | `/recetas/:id` | |
| Campo ID | `id` | `cca3` | `idMeal` | |
| Campo "título" | `nombre` | `nombre.común` | `strMeal` | |
| Ruta de React (detalle) | `/clima/:id` | `/pais/:cca3` | `/recetas/:id` | |
| Clave de localStorage | `historialConsultas` | `paisesRecientes` | `recetasRecientes` | |
| Qué se guarda | `{id, ciudad, fecha}` | `"ARG"` | `"53262"` | |

**Método para adaptar (siempre el mismo):**
1. Completá la columna "Tu parcial" mirando el **paso 1** (API en el navegador) y el `js/` vanilla (`localStorage`).
2. Hacé los pasos 3 → 8 con esos nombres. Usá **buscar y reemplazar** del editor (`Ctrl+Shift+H` en VS Code) sobre mis moldes: `ITEMS`/`items` → tu nombre, `RECURSO`, `CLAVE_DE_LA_LISTA`, `ID`, etc.
3. **Después de cada paso, mirá el ✅.** Si no se cumple, no sigas: arreglalo ahí (F12 Console y Network te dicen qué pasó).

Referencia con TODO armado y probado: `soluciones/historial/Clima/src/` (el más simple), `Paises/` (filtros + búsqueda), `Recetas/`.
Si la conversión del vanilla te cuesta: [`02-de-vanilla-a-react.md`](02-de-vanilla-a-react.md).
