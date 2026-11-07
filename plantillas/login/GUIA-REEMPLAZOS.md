# 🔐 PLANTILLA LOGIN — qué reemplazar según lo que te pidan

> Leé esto ANTES de copiar `src/`. Orden: **(1) completá la ficha → (2) copiá y renombrá → (3) elegí versiones → (4) mirá "si piden X"**.
> Tema típico: GameHub, TrailerFlix, Eventos (login con `POST /api/login` + `AuthContext` + catálogo + detalle).

---

## PASO 1 — FICHA (5 min). Completala mirando el vanilla (`js/*.js`), `server/*.js` y `curl`

| # | Pregunta | Dónde mirar | Se usa en |
|---|---|---|---|
| 1 | **Puerto** del server (¡TrailerFlix = 3001!) | `server/*.js` → `PORT` | `api/client.js` → `API_ORIGIN` |
| 2 | **Endpoint de la lista** | `fetch(` en `js/app.js` | `hooks/useItems.js` → `ENDPOINT` |
| 3 | ¿Lista **plana** `[..]`, **envuelta** `{x:[..]}` o **agrupada** `{PC:[..],Xbox:[..]}`? | `curl .../api/<lista>` | `useItems.js` (`.then`), `Home.jsx` (V1 o V2) |
| 4 | **Endpoint de detalle** y campo **ID** | `curl .../api/<lista>/1` | `useItems.js` → `useItem`, `ItemCard`, `Home` |
| 5 | **¿Qué responde el login?** | `curl -X POST .../api/login -H "Content-Type: application/json" -d '{"username":"..","password":".."}'` | `useLogin.js` → **`armarSesion`** |
| 6 | **Qué se guarda en localStorage** | `localStorage.setItem(` en `js/login.js` | `AuthContext.jsx` → `KEY_*`, `leerSesion`, `login` |
| 7 | ¿Hay **rol** (admin/vip)? | respuesta del login | `AuthContext`, `Layout`, `RutaProtegida` |
| 8 | **Rutas** del enunciado | README → "Routing" | `App.jsx` + `Link to` de `ItemCard` |
| 9 | **Imágenes**: ¿URL completa o relativa (`./posters/x.jpg`)? | JSON | `ItemCard` + `client.js` → `imgUrl()` |
| 10 | **Campos** de card y detalle | `retornoCard()` / `juego.js` / `evento.js` | `ItemCard.jsx`, `ItemDetail.jsx` |
| 11 | ¿Piden **ordenar**, **ocultar algo vacío**, **algo según rol/sesión**? | README + rúbrica | `Home`, `ItemDetail`, `ItemCard`, `Layout` |
| 12 | **Credenciales** de prueba | README / `server/*.js` | para probar |

---

## PASO 2 — Copiar y renombrar

```bash
cp -r react/src react/src.bak
cp -r ~/Documents/modelos-react/cheatsheet-react/plantillas/login/src/. react/src/
```
Buscar/reemplazar en `src/` (distinguiendo mayúsculas), **en este orden**:

| Buscar | Reemplazar (ej. Eventos) |
|---|---|
| `Items` | `Eventos` |
| `items` | `eventos` |
| `Item` | `Evento` |
| `item` | `evento` |

Renombrá los **archivos** (`ItemCard.jsx` → `EventoCard.jsx`, `ItemDetail.jsx` → `EventoDetailPage.jsx`, `useItems.js` → `useEventos.js`).
**Mirá los nombres del esqueleto**: si `App.jsx` importa `{ EventoDetailPage }`, tu export tiene que llamarse así (si no, no compila).

---

## PASO 3 — Qué poner en `armarSesion` y `AuthContext` (lo más importante del login)

Mirá la respuesta del `curl` del login (ficha #5) y elegí:

| El login responde… | `useLogin.js` → `armarSesion` | `AuthContext` guarda | `Layout` muestra |
|---|---|---|---|
| `{ id, username, firstName, lastName, rol }` (**GameHub, Eventos**) | `{ fullName: \`${r.firstName} ${r.lastName}\`, rol: r.rol }` | `usuario` + `rol` | `user.fullName` · `user.rol` |
| `{ ok: true, username }` (**TrailerFlix**) | `{ username: r.username }` | solo `usuario` | `user.username` |
| `{ token, user: {...} }` | `{ fullName: r.user.name, rol: r.user.rol, token: r.token }` | + `token` | según corresponda |

**TrailerFlix (sin rol)** → en `AuthContext.jsx` usá la variante marcada "SI NO HAY ROL" (3 lugares: `leerSesion`, `login`, y borrar `KEY_ROL`). El `Layout` pasa a `Bienvenido, {user.username}`.

---

## PASO 4 — "SI PIDEN X → cambiá Y"

### Login y sesión

| Si el enunciado dice… | Cambiá |
|---|---|
| "formulario de login con POST /api/login" | ya está (`useLogin` + `LoginForm`) |
| "Context de autenticación" | `AuthContext` + `<AuthProvider>` en `main.jsx` (ya está) |
| "persistir sesión al recargar" | `leerSesion()` lazy init (ya está) · las claves = las del vanilla |
| "cerrar sesión" | `logout` + botón en `Layout` (ya está) |
| "cambiar el navbar al loguear" | `Layout`: `{user ? ... : <LoginForm/>}` (ya está) |
| "mostrar nombre y rol" | `Layout`: `{user.fullName} - {user.rol}` |
| "mensaje si credenciales incorrectas" | `useLogin`: `err.status === 401` (ya está) |
| "validar campos vacíos" | `useLogin`: descomentar el `if (!username.trim() ...)` |
| "redirigir tras el login" | `useLogin`: `useNavigate` + `navigate("/")` |
| "solo admin / VIP ve X" | `{user?.rol === "vip" && <X/>}` en `Layout` / `ItemCard` / `ItemDetail` |
| "ruta solo para logueados" | `RutaProtegida` + `App.jsx` (bloque comentado) |
| "ruta solo para admin" | `<RutaProtegida rol="admin">` |
| "token / Authorization" | `client.js` (header comentado) + guardar/borrar en `AuthContext` |
| "hook `useLogin` / `useAuth`" | ya están |

### Datos

| Si… | Cambiá |
|---|---|
| Lista plana | `useItems` tal cual · `Home` V1 |
| Lista envuelta `{eventos:[..]}` | `useItems` → `setItems(data.eventos)` |
| Lista **agrupada** (GameHub) | `useItems` → `useState(null)` · `Home` **V2** · `GRUPOS = [...]` |
| El detalle necesita saber a qué grupo pertenece | bajar `/lista` completa y `Object.entries(todos).find(...)` (nota en `Home.jsx`) |
| Puerto 3001 | `API_ORIGIN = "http://localhost:3001"` |
| Imágenes relativas | `imgUrl(item.poster)` en la card y el detalle |
| "ordenar por fecha / precio / nombre" | `Home` → bloque `sort` sobre copia `[...items]` y mapear `ordenados` |
| "ocultar X si la lista viene vacía" | `ItemDetail` → `const x = item.x || []` + `x.length > 0 ? ... : <p>…</p>` |
| "mostrar Agotado" | `ItemCard` → `item.tickets_disponibles === 0` |
| "iframe de trailer" | `ItemDetail` → `{item.trailer && <iframe src={item.trailer} />}` |
| campo con tilde (`año`) | `item.año` |
| detalle con campos anidados | `item.requisitos?.procesador` + valores por defecto `|| {}` |
| 404 en el detalle | `useItem` ya deja `item = null` y la página muestra "no encontrado" |

### Rutas

| Enunciado | Cambiá en TODOS (deben coincidir) |
|---|---|
| `/eventos/:id` | `App.jsx` (`path`) · `ItemCard.jsx` (`Link to`) |
| el parámetro se llama distinto (`:slug`) | `App.jsx` + `useParams()` en el detalle |
| 404 | `path="*"` ya está (última) |

### UI / rúbrica

| Piden… | Dónde |
|---|---|
| componentes (`EventoCard`, `Layout`, `LoginForm`) | ya están separados |
| hooks (`useEventos`, `useLogin`) | `useItems.js` renombrado · `useLogin.js` |
| loading / error | `Home`, `ItemDetail`, `LoginForm` (`loading`/`error`) |
| "sin `document.getElementById`" | todo ya es controlado (`value` + `onChange`) |

---

## Antes de entregar
`npm run build` ✔ · F12 sin rojos ✔ · lista → detalle → `/xyz` 404 ✔ · login mal (401) / bien / **F5 sigue logueado** / logout ✔ · navbar cambia con sesión ✔ · rúbrica punto por punto ✔
