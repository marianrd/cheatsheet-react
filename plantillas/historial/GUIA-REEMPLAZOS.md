# 🕘 PLANTILLA HISTORIAL — qué reemplazar según lo que te pidan

> Leé esto ANTES de copiar `src/`. Orden: **(1) completá la ficha → (2) copiá y renombrá → (3) elegí versiones → (4) mirá "si piden X"**.
> Tema típico: Clima, Países, Recetas (historial/recientes en `localStorage` + Context).

---

## PASO 1 — FICHA (5 min). Completala mirando el vanilla (`js/*.js`), `server/*.js` y `curl`

Escribila en un papel o en un comentario. Cada línea te dice qué poner y dónde.

| # | Pregunta | Dónde mirar | Se usa en |
|---|---|---|---|
| 1 | **Puerto** del server | `server/*.js` → `PORT` / `listen(` | `services/api.js` → `API_BASE` |
| 2 | **Endpoint de la lista** (`/ciudades`, `/paises`, `/recetas`) | `fetch(` en `js/*.js` | `api.js` → `ENDPOINT` |
| 3 | ¿La **lista viene envuelta**? `[..]` o `{ciudades:[..]}` | `curl .../api/<lista>` | `api.js` → `LISTA_KEY` (`null` o `"ciudades"`) |
| 4 | ¿El **detalle viene envuelto**? `{..}` o `{pais:{..}}` | `curl .../api/<lista>/<id>` | `api.js` → `DETALLE_KEY` |
| 5 | **Campo ID** y su tipo (`id` número · `cca3` string · `idMeal` string) | JSON | `ItemCard`, `Home` (key), `ItemDetail`, `Recientes` |
| 6 | ¿IDs **repetidos** en el JSON? | `grep '"id"' data/*.json` | si sí → `key={index}` y `value={index}` |
| 7 | **Filtros** (nombres de query) | `req.query.xxx` en el server | `Home.jsx` (`filtros`) + `Filtros.jsx` |
| 8 | **Endpoints de opciones** de los selects | `fetch(` en el vanilla | `Filtros.jsx` → `getOpciones(...)` |
| 9 | **Clave de localStorage** | `localStorage.setItem(` en el vanilla | `Context` → `STORAGE_KEY` |
| 10 | **Qué guarda**: ¿solo ids o objetos con fecha? | `guardarEnHistorial` / `addToRecientes` | Context versión A o B · Recientes A o B |
| 11 | **Límite** (`MAX`, `slice(0, N)`) | vanilla | Context → `MAX_RECIENTES` |
| 12 | **Orden**: ¿nuevo primero (`unshift`) o llegada (`push`)? | vanilla | Context (A o B + variantes) |
| 13 | **Rutas** que exige el enunciado | README → "Routing" | `App.jsx`, `ItemCard`, `Recientes`, `Header` |
| 14 | **Campos de la card** y **del detalle** | `retornoCard()` / `showDetalle()` | `ItemCard.jsx`, `ItemDetail.jsx` |

---

## PASO 2 — Copiar y renombrar

```bash
cp -r react/src react/src.bak                                   # backup del esqueleto
cp -r ~/Documents/modelos-react/cheatsheet-react/plantillas/historial/src/. react/src/
```
Buscar/reemplazar en todo `src/` (con distinción de mayúsculas), **en este orden**:

| Buscar | Reemplazar (ej.) | Afecta a |
|---|---|---|
| `Items` | `Recetas` | `ItemsRecientesContext`, `useItemsRecientes`, `getItems`, `ItemsRecientesProvider` |
| `items` | `recetas` | variables, `/items/:id`, `ENDPOINT`, clave de localStorage |
| `Item` | `Receta` | `ItemCard`, `ItemDetail`, `getItem` |
| `item` | `receta` | variables |

Después renombrá los **archivos** igual, y **mirá qué nombres espera el esqueleto**: si ya tenía `HistorialConsultasContext.jsx`, `useHistorialConsultas.js`, `ClimaDetail.jsx`, usá **esos** nombres (así no hay que cambiar sus imports):
- Context: exportá lo que importa su `App.jsx`/hook (`HistorialConsultasContext`, `HistorialConsultasProvider`).
- Funciones del Context: usá los nombres del esqueleto (`agregarConsulta`, `limpiarHistorial`).

---

## PASO 3 — Elegí las versiones (según la ficha #10 y #7)

| Si tu tema es… | Context | Recientes | Home | Detalle llama a |
|---|---|---|---|---|
| **Guarda objetos con fecha**, un `<select>` de ciudades (**Clima**) | **B** | **B** | **V2** | `agregarX(data.id, data.nombre)` |
| **Guarda ids**, filtros + buscador (**Países, Recetas**) | **A** | **A** | **V1** | `agregarX(data.id)` |
| Guarda ids, lista simple sin filtros | A | A | V3 (V1 sin `<Filtros/>`) | `agregarX(data.id)` |
| Guarda objetos, lista de cards con filtros | B | B | V1 | `agregarX(data.id, data.nombre)` |

*Versión A/B/V1/V2 = bloques marcados con esas letras dentro de cada archivo. Lo que no uses, borralo.*

---

## PASO 4 — "SI PIDEN X → cambiá Y"

### Historial (Context)

| Si el enunciado / vanilla dice… | Cambiá | Por |
|---|---|---|
| "últimas **15** consultas" / `slice(0, 15)` / `MAX = 15` | `Context` → `MAX_RECIENTES` | `15` |
| "sin límite" / no hay `slice` | `MAX_RECIENTES` | `Infinity` |
| "sin duplicados" | nada: ya está | A: `filter` · B: `some` |
| "más reciente primero" (`unshift`) | A: ya está · B: `[nuevo, ...prev]` | — |
| "en orden de consulta" (`push`) | B: `[...prev, nuevo]` | — |
| "si repite, subirlo arriba" | A con objetos: `[{id,nombre,fecha}, ...prev.filter(r => r.id !== id)]` | — |
| "guardar fecha y hora" | versión B | `fecha: new Date().toLocaleString()` |
| "guardar solo el id" | versión A | `agregarX(data.id)` |
| "botón limpiar" | `<button onClick={limpiarX}>` | ya exportado en el `value` |
| "borrar uno" | `<button onClick={() => quitarReciente(r.id)}>` | en B cambiar `r !== id` por `r.id !== id` |
| "contador de visitas" | Context: bloque comentado | — |
| "favoritos" | segundo Context igual al del historial | `toggleFavorito` |
| "el hook se llama `useHistorialConsultas`" | renombrar `useItemsRecientes` | — |
| "mismos nombres que el vanilla (localStorage)" | `STORAGE_KEY` | la clave exacta del vanilla |

### Datos y filtros

| Si… | Cambiá |
|---|---|
| La API devuelve `{ciudades:[...]}` | `LISTA_KEY = "ciudades"` |
| El detalle devuelve `{pais:{...}}` | `DETALLE_KEY = "pais"` |
| El server **no tiene** endpoint de detalle | `getItem`: bajar la lista y `.find(...)` (bloque comentado en `api.js`) |
| El esqueleto llama a un endpoint que no existe (Clima: `/clima/:id`) | `ENDPOINT`/`getItem` al real (`/ciudades/:id`) |
| Hay 2 selects + buscador | `Filtros.jsx` tal cual; renombrá `categoria`/`area` |
| Hay **1** select | borrá el otro `<select>`, su `useState`, su `getOpciones` y su clave en `Home` (`filtros`, `getItems({...})`, deps del `useEffect`) |
| Solo buscador de texto | dejá solo el `<input>` |
| Sin filtros | borrá `Filtros.jsx`, `useDebounce`, `filtros`; `getItems()` sin args; `useEffect(..., [])` |
| "buscador con debounce de 500ms" | `Home` → `useDebounce(filtros.buscar, 500)` (ya está) |
| La API **no filtra** (hay que filtrar en el cliente) | `Home` → bloque `items.filter(...)` |
| "ordenar por nombre / población / precio" | `Home` → bloque `[...items].sort(...)` y usarlo en el `.map` |
| IDs repetidos (Clima: id 3) | `key={index}`, `value={index}` y `items[Number(seleccion)].id` |
| El campo tiene **tilde** (`nombre.común`) | escribilo con tilde y `?.`: `item.nombre?.común` |
| Una propiedad es **objeto** (`idiomas`) | `Object.entries(item.idiomas || {})` |
| Campos numerados (`strIngredient1..20`) | `for` del bloque comentado en `ItemDetail` |
| Hay video YouTube | bloque comentado: convertir a `/embed/ID` y renderizar solo si existe |

### Rutas

| Si el enunciado dice… | Cambiá en TODOS estos lugares (deben coincidir) |
|---|---|
| ruta `/clima/:id` | `App.jsx` (`path`) · `ItemCard.jsx` (`Link to`) · `Recientes.jsx` (`Link to`) · `Home.jsx` V2 (`navigate`) |
| el parámetro se llama `:cca3` | `App.jsx` + `useParams()` en el detalle (`const { cca3 } = useParams()`) |
| ruta de recientes `/recientes` | `App.jsx` + `Header.jsx` |
| 404 | `path="*"` ya está (siempre última) |

### UI / rúbrica

| Si piden… | Dónde |
|---|---|
| loading y error | ya en `Home`, `ItemDetail`, `Recientes` |
| "manejo de ciudad que no existe" | `ItemDetail` → `err.status === 404` (ya está) |
| "componentes reutilizables" | `ItemCard`, `Loading`, `ErrorMessage`, `Filtros`, (`HistorialLista`) |
| "custom hooks" | `useItemsRecientes` + `useDebounce` (ya están) |
| "historial visible en Home y Detalle" | extraer la `<ul>` de Recientes B a `HistorialLista.jsx` y usarlo en las 3 páginas |
| "badge con cantidad" | `Header.jsx` (ya está) |

---

## Antes de entregar
`npm run build` ✔ · F12 sin rojos ✔ · lista → detalle → `/xyz` 404 ✔ · id inexistente → mensaje ✔ · historial: sin duplicados, F5 persiste, límite, limpiar ✔ · rúbrica punto por punto ✔
