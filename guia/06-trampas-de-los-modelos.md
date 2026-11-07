# 06 · Trampas reales de los modelos (verificadas en los 6 repos)

Los esqueletos `react/` tienen errores. Si el parcial de mañana usa el mismo generador de esqueletos, **te los vas a cruzar**.

## 1. Los esqueletos están copiados de GameHub (nombres y export mal)

TrailerFlix, Eventos y Recetas traen el esqueleto de **GameHub** con otro nombre de archivo:

| Examen | Archivo | Contiene | Pero `App.jsx` importa |
|---|---|---|---|
| TrailerFlix | `pages/PeliculaDetailPage.jsx` | `export function GameDetailPage` | `{ PeliculaDetailPage }` ❌ |
| Eventos | `pages/EventoDetailPage.jsx` | `export function GameDetailPage` | `{ EventoDetailPage }` ❌ |
| Recetas | `pages/RecetaDetailPage.jsx` | `export function GameDetailPage` | `{ RecetaDetailPage }` ❌ |

→ **Vite no compila** hasta que renombres el `export function` para que coincida con el import.
Además: `GameCard.jsx` (recibe `game`/`platform`), `useGames.js` (`gamesByPlatform`), comentarios con `/videojuegos` y `/api` en puerto 3000 — todo de GameHub. **Renombrá/reescribí** a tu dominio; borrá lo que no uses.

**Recetas** ni siquiera trae esqueleto de historial: tiene `AuthContext`/`LoginForm` de GameHub y un `index.css` de GameHub. Lo que se pide (`RecetasRecientesContext`, `/recientes`) lo creás vos. Copiá `css/styles.css` del vanilla a `react/src/index.css` para que se vea bien.

**Paises**: `App.jsx` está vacío (`<div className="app"></div>`) → armá Router + Provider + Routes.
**Clima**: `App.jsx` y `Header` ya vienen hechos; completás services, context y 3 páginas.

## 2. Falta el `BrowserRouter` y el Provider

En los esqueletos de login, `main.jsx` renderiza `<App />` a secas, pero `Layout` ya usa `useAuth()`, `Link`, `useNavigate()`. Sin `<BrowserRouter><AuthProvider>` en `main.jsx` → error y pantalla blanca. Ver [03 Paso 1](03-tipo-login.md).

## 3. Puerto incorrecto en TrailerFlix

El esqueleto trae `API_BASE_URL = "http://localhost:3000/api"` pero el server de **TrailerFlix escucha en 3001**. Mirá siempre `const PORT` / `app.listen` en `server/*.js` y el `README`.

## TrailerFlix: posters

El JSON trae `"poster": "./posters/3.jpg"` (relativo). En el vanilla andaba porque el HTML lo servía el mismo Express. En React la página está en `:5173`, entonces `./posters/3.jpg` busca en el servidor equivocado → imágenes rotas.
Solución (el Express sirve `posters/` como estático):
```js
export const posterUrl = (p) => `http://localhost:3001/${p.replace("./", "")}`;
// <img src={posterUrl(item.poster)} />
```
(Eventos no tiene este problema: sus imágenes ya son URLs absolutas `http://localhost:3000/img/...`.)

## 4. Respuestas "envueltas" vs "planas"

| API | Lista | Detalle |
|---|---|---|
| GameHub `/videojuegos` | **objeto agrupado** `{PC:[..],Xbox:[..]}` | objeto del juego |
| TrailerFlix `/contenido` | array | objeto |
| Eventos `/eventos` | array | objeto |
| Clima `/ciudades` | `{ ciudades: [...] }` | objeto |
| Paises `/paises` | `{ success, total, paises: [...] }` | `{ success, pais }` |
| Recetas `/recetas` | `{ success, total, recetas: [...] }` | `{ success, receta }` |

`curl` primero. Si hacés `data.map` sobre un objeto → `data.map is not a function`.

## 5. Login: cada API responde distinto

GameHub → usuario completo; TrailerFlix → `{ok, username}` (solo `usuario` en localStorage, **sin rol**); Eventos → `{ok, ...usuario sin password}`. Todos dan **401** con credenciales malas. El esqueleto asume `fullName` + `rol`: adaptalo (ver tabla en [03 Paso 7](03-tipo-login.md)).

## 6. Clima: datos con ids repetidos (no es tu bug)

`data/datos.json` tiene **dos ciudades con `id: 3`** (Lima y Ciudad de México) y **dos "Lima"** (ids 3 y 6).
- No uses `id` ni `nombre` como `key`/`value` del `<option>`: usá el **índice** (`key={i} value={i}`).
- `/clima/3` siempre devuelve Lima (el server hace `find`). El vanilla se comporta igual. No pierdas tiempo.
- En el historial se deduplica por `id`, así que Lima(3) y CDMX(3) cuentan como la misma.

## 7. Recetas/Paises: IDs son strings, y usan tildes

- `idMeal` y `cca3` son **strings**, y `useParams()` siempre devuelve string: pasalos tal cual a la URL del API. En GameHub/Eventos/TrailerFlix el `id` del JSON es **número**: si comparás en el cliente (`v.id === Number(id)`) convertí; si solo lo interpolás en la URL (`/videojuegos/${id}`) no hace falta.
- Campos con tilde: `pais.nombre.común`, `pais.región`, `pais.población`, `info.símbolo`, `juego.año`. Si escribís `comun` no anda.
- `strInstructions` trae `\r\n`: mostralo con CSS `white-space: pre-line`.
- YouTube: el JSON trae URLs `watch?v=...`; el iframe necesita `/embed/ID`. Usá `getYouTubeEmbedUrl` del vanilla y **solo renderizá el iframe si devuelve algo** (eso es la "validación").

## 8. Modo estricto (`React.StrictMode`)

En desarrollo React ejecuta cada `useEffect` **dos veces** al montar. Por eso ves 2 requests en Network (es normal, no es un bug) y por eso el historial **tiene que ser idempotente**: `setX(prev => ya está ? prev : [...])`. No quites `StrictMode` para "arreglarlo".

## 9. Los 3 bucles infinitos más comunes

1. `useEffect(() => { setX(...) })` sin array.
2. Poner un **objeto/array/función creada en el render** como dependencia (`[filtros]`, `[onChange]`) y que el efecto haga `setState`. → usá valores primitivos o `useCallback`.
3. Llamar `setX()` directamente en el cuerpo del componente (no en un efecto ni handler).

## 10. Componente de filtros que "pierde el foco"

`if (loading) return <Loading />` al principio del Home hace que los filtros desaparezcan mientras carga → el `<input>` se desmonta y pierde el foco con cada tecla. Dejá el `<Filtros/>` fuera de los returns tempranos y condicioná solo la lista.

## 11. Otros detalles

- `vite.config.js` fija `port: 5173` en algunos; en otros (Clima/Paises) el puerto lo elige Vite: usá la URL que imprime la terminal.
- Si tenés algo ocupando el puerto de la API: `ss -ltnp | grep 3000`. Cambiarlo en el server es "modificar el comportamiento de la API" → no recomendado.
- En el modelo de Clima, `vanilla` lee `/data/datos.json` directo; en React la rúbrica pide **API** (`/api/ciudades`) → usá el server (`node server/mockServer.js`).
- Los `server/` con `"type": "module"` (Clima, Paises, Recetas) usan `import`; los de GameHub/TrailerFlix/Eventos, `require`. No los mezcles si tocás algo.
- Instalar dependencias: **dos** `npm install` (uno en `server/`, otro en `react/`).
