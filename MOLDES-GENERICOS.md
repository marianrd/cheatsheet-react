# 🧩 MOLDES GENÉRICOS — copiar, reemplazar, listo

Dos plantillas **que compilan** (probadas con `vite build`) y sirven para CUALQUIER tema:

| Si el enunciado habla de… | Usá | Carpeta |
|---|---|---|
| **login / AuthContext / POST /api/login** | plantilla LOGIN | [`plantillas/login/src/`](plantillas/login/src) |
| **historial / recientes / localStorage / Context de consultas** | plantilla HISTORIAL | [`plantillas/historial/src/`](plantillas/historial/src) |

Dentro de cada archivo vas a ver dos marcas:
- `🔧 CAMBIAR` → un valor que SÍ o SÍ hay que adaptar a tu tema.
- `SI PIDEN … →` → un bloque opcional (comentado) para ese requisito. Lo descomentás o lo borrás.

---

## 1. Cómo usarlas (15 min)

1. **Levantá el server y mirá la forma de la API** (esto manda sobre todo lo demás):
   ```bash
   cd server && npm install && npm start       # anotá el PUERTO
   curl localhost:3000/api/<lista>              # ¿array? ¿envuelto { xxx: [...] }? ¿agrupado?
   curl localhost:3000/api/<lista>/<un id>      # ¿objeto directo? ¿envuelto { pais: {...} }?
   ```
2. **Copiá la plantilla** encima de `react/src/` del examen (o archivo por archivo, si el esqueleto ya trae cosas):
   ```bash
   cp -r ~/Documents/modelos-react/cheatsheet-react/plantillas/historial/src/. react/src/     # o /login/
   ```
   > Si el esqueleto trae `index.css`, **no lo pises** (la plantilla no trae uno). Hacé backup: `cp -r react/src react/src.bak`.
3. **Buscar y reemplazar** en todo `src/` (VS Code: `Ctrl+Shift+H`, activá **mayúsculas/minúsculas** y **palabra completa** apagada). **En este orden**:

   | # | Buscar | Reemplazar por (ej. Recetas) | Qué cambia |
   |---|---|---|---|
   | 1 | `Items` | `Recetas` | nombres de componentes/hooks/context (`ItemsRecientesContext`) |
   | 2 | `items` | `recetas` | variables, rutas (`/items/:id`), endpoint, clave localStorage |
   | 3 | `Item` | `Receta` | `ItemCard`, `ItemDetail`, `getItem`, `useItem` |
   | 4 | `item` | `receta` | variables (`item.nombre`) |

   Después **renombrá los archivos** para que coincidan (`ItemCard.jsx` → `RecetaCard.jsx`, etc.).
4. **Recorré los `🔧 CAMBIAR`** (sección 2 te dice dónde están, archivo por archivo). Buscá `🔧` con `Ctrl+Shift+F`.
5. **Probá** en este orden: `npm run build` ✔ → lista → detalle → 404 → login/historial → F5.

> ⚠️ Después de reemplazar, buscá palabras del tema anterior que se hayan colado (`item`, `Paises`, `cca3`, `recientes`...).

---

## 2. Qué reemplazar y DÓNDE (mapa por archivo)

### 2.A — Plantilla HISTORIAL (`plantillas/historial/src/`)

| Archivo | Qué hay que cambiar (🔧) | Cómo saber el valor |
|---|---|---|
| `services/api.js` | `API_BASE` (puerto) · `ENDPOINT` · `LISTA_KEY` · `DETALLE_KEY` | `server/*.js` (`PORT`, `app.get`) + `curl` |
| `context/ItemsRecientesContext.jsx` | `STORAGE_KEY` · `MAX_RECIENTES` · versión A (ids) o B (objetos) | `js/*.js` del vanilla: `localStorage.setItem(`, `slice(`, `MAX` |
| `hooks/useItemsRecientes.js` | solo el nombre | = nombre del Context |
| `hooks/useDebounce.js` | nada (el delay lo pasás al usarlo) | vanilla: `debounce(fn, 500)` |
| `main.jsx` | nombre del Provider | ⚠️ no duplicar Router/Provider si el esqueleto ya los trae |
| `App.jsx` | path del detalle `/items/:id` · texto del Header | enunciado: "Routing" |
| `components/Header.jsx` | título de la app · links | enunciado |
| `components/ItemCard.jsx` | campos (`titulo`, `imagen`, `subtitulo`) · `Link to` + campo id | `retornoCard()` / `renderXxx()` del vanilla + JSON |
| `components/Filtros.jsx` | nombres de filtros · endpoints de `getOpciones` | `req.query.xxx` del server · `js/*.js` (`loadXxx`) |
| `pages/Home.jsx` | claves de `filtros` (= query params de la API) · `key` · versión 1/2/3 | server: `req.query` |
| `pages/ItemDetail.jsx` | campos del detalle · qué se pasa a `agregarItemReciente` | `showDetalle()`/`mostrarXxx()` del vanilla |
| `pages/Recientes.jsx` | variante A (ids → pedir a la API) o B (objetos) | = lo que guarda el Context |

### 2.B — Plantilla LOGIN (`plantillas/login/src/`)

| Archivo | Qué hay que cambiar (🔧) | Cómo saber el valor |
|---|---|---|
| `api/client.js` | `API_ORIGIN` (puerto) · `imgUrl` si las imágenes son relativas | `server/*.js` · JSON (`"./posters/3.jpg"`) |
| `context/AuthContext.jsx` | `KEY_USUARIO`/`KEY_ROL` · forma de `leerSesion()`, `login()` | `js/login.js` del vanilla: `localStorage.setItem` |
| `hooks/useLogin.js` | **`armarSesion`** (respuesta del login → sesión) · mensajes | `curl -X POST .../login -d '{"username":..,"password":..}'` |
| `hooks/useItems.js` | `ENDPOINT` · `.then` si viene envuelto · estado inicial (`[]` o `null` si agrupado) | `curl` |
| `components/LoginForm.jsx` | normalmente nada | — |
| `components/Layout.jsx` | título · qué dato del usuario mostrar (`fullName`/`username`/`rol`) · footer | `armarSesion` |
| `components/ItemCard.jsx` | campos · `Link to` + id · imagen | JSON + `retornoCard()` |
| `pages/Home.jsx` | título · orden · versión 1 (plana) o 2 (agrupada) | `curl` |
| `pages/ItemDetail.jsx` | campos del detalle · render condicional | `js/juego.js` / `evento.js` / `pelicula.js` |
| `App.jsx` | path del detalle `/items/:id` · rutas protegidas | enunciado |
| `main.jsx` | nada (salvo duplicados con el esqueleto) | — |

---

## 3. "SI PIDEN X →" (índice rápido: qué tocar)

### Historial

| Si piden… | Dónde y qué |
|---|---|
| **MAX N** / "últimas N" / "máximo 15" | `ItemsRecientesContext.jsx` → `MAX_RECIENTES = N` (el `.slice(0, MAX)` ya está) |
| **Sin límite** | `MAX_RECIENTES = Infinity` |
| **Sin duplicados** | ya está: versión A (`filter` + `[id, ...]`) y versión B (`prev.some(...) ? prev : ...`) |
| **Más nuevo primero** | versión A (default) · en B: `[nuevo, ...prev]` |
| **Orden de llegada (más viejo primero)** | versión B: `[...prev, nuevo]` |
| **Si ya existe, subirlo y refrescar fecha** | versión A con objetos: `[{ id, nombre, fecha }, ...prev.filter(r => r.id !== id)]` |
| **Guardar fecha/hora** | versión B → `fecha: new Date().toLocaleString()` |
| **Persistir en localStorage** | ya está (`useEffect([recientes])` + `leer()` lazy) |
| **Limpiar historial** | `limpiarRecientes` (ya en el value) → botón `onClick={limpiarRecientes}` |
| **Borrar UNO** | `quitarReciente(id)` (ya está) → `<button onClick={() => quitarReciente(r.id)}>` |
| **Contador de visitas** | comentario en el Context (sumar a `visitas`) |
| **Favoritos (toggle)** | comentario en el Context: otro Context con `toggleFavorito` |
| **Mostrar cantidad en el navbar** | ya está en `Header.jsx` (`Recientes ({recientes.length})`) |
| **Ver recientes en Home/Detalle** | extraer la lista a un componente `HistorialLista` y usarlo en las 3 páginas |
| **Hook personalizado** (rúbrica) | `useItemsRecientes` + `useDebounce` ya están · extra: mover el fetch a `useItems()` |
| **Debounce en el buscador** | `Home.jsx` → `useDebounce(filtros.buscar, 500)` (ya está) |
| **Filtros que llegan por la API** (selects) | `Filtros.jsx` + `getOpciones("/categorias","categorias")` |
| **Filtrar en el cliente** (la API no filtra) | `Home.jsx` → comentario con `items.filter(...)` |
| **Ordenar** | `Home.jsx` → comentario con `[...items].sort(...)` |
| **Paginación / "ver más"** | `Home.jsx` → comentario con `slice(0, cuantos)` |
| **Un solo `<select>` + botón (Clima)** | `Home.jsx` → VERSIÓN 2 |
| **Mostrar "ciudad/ítem no existe"** | `ItemDetail.jsx` ya distingue `err.status === 404` |
| **Lista de tabla (Clima)** | `ItemDetail.jsx` → comentario `<table>` |
| **Campos con tilde** (`nombre.común`, `región`) | `ItemCard.jsx` / `ItemDetail.jsx` → con tilde y `?.` |
| **Campos numerados** (`strIngredient1..20`) | `ItemDetail.jsx` → comentario con el `for` |
| **Video de YouTube** | `ItemDetail.jsx` → comentario del embed |
| **Ids repetidos en el JSON** | `key={index}` en vez de `key={item.id}` |

### Login

| Si piden… | Dónde y qué |
|---|---|
| **Formulario de login con POST** | `useLogin.js` + `LoginForm.jsx` (ya está) |
| **AuthContext** | `AuthContext.jsx` (ya está) + `main.jsx` con `<AuthProvider>` |
| **Sesión persistente (F5)** | `leerSesion()` lazy init + `login()` escribe en localStorage (ya está) |
| **Logout** | `logout` en el Context + botón en `Layout.jsx` (ya está) |
| **Cambiar el navbar al haber sesión** | `Layout.jsx` → `{user ? <Bienvenido/> : <LoginForm/>}` (ya está) |
| **Mostrar el rol** | `Layout.jsx` → `{user.rol}` |
| **Mensaje de login incorrecto (401)** | `useLogin.js` → `err.status === 401` (ya está) |
| **Servidor caído** | `useLogin.js` → `err instanceof TypeError` (ya está) |
| **Validar campos vacíos** | `useLogin.js` → comentario `if (!username.trim() ...)` |
| **Redirigir tras login** | `useLogin.js` → comentario `navigate("/")` |
| **Solo para admin/VIP** (ver algo) | `Layout.jsx` / `ItemCard.jsx` / `ItemDetail.jsx` → `user?.rol === "vip"` |
| **Ruta protegida** | `RutaProtegida.jsx` + `App.jsx` (comentario) |
| **Token / Authorization** | `client.js` (header comentado) + `AuthContext` (guardar/borrar token) |
| **Respuesta del login distinta** | `useLogin.js` → `armarSesion` (3 ejemplos) |
| **Lista agrupada (GameHub)** | `useItems.js` estado `null` + `Home.jsx` VERSIÓN 2 |
| **Ordenar por fecha/precio** | `Home.jsx` → comentario con `sort` (copiar con `[...items]`) |
| **Render condicional si la lista viene vacía** | `ItemDetail.jsx` (ejemplo con `invitados`) |
| **Agotado / sin stock** | `ItemCard.jsx` → `item.tickets_disponibles === 0` |
| **Imágenes relativas (`./posters/3.jpg`)** | `client.js` → `imgUrl()` |
| **Iframe de trailer/video** | `ItemDetail.jsx` → `{item.trailer && <iframe .../>}` |
| **Hooks personalizados** (`useEventos`, `useLogin`) | `useItems.js` (renombrar) y `useLogin.js` |

---

## 4. Valores reales de los 6 modelos (para no tener que adivinar)

### LOGIN

| | GameHub | TrailerFlix | Eventos |
|---|---|---|---|
| Puerto | 3000 | **3001** | 3000 |
| Lista | `/videojuegos` → **agrupado** `{PC:[..],Xbox:[..]}` | `/contenido` → array | `/eventos` → array |
| Detalle | `/videojuegos/:id` | `/contenido/:id` | `/eventos/:id` |
| Ruta React | `/juegos/:id` | `/peliculas/:id` | `/eventos/:id` |
| Respuesta login | usuario completo (`firstName`, `lastName`, `rol`) | `{ ok, username }` | usuario completo |
| `armarSesion` | `{ fullName: \`${r.firstName} ${r.lastName}\`, rol: r.rol }` | `{ username: r.username }` | igual que GameHub |
| localStorage | `usuario` + `rol` | solo `usuario` | `usuario` + `rol` |
| Imágenes | URL completa | `./posters/x.jpg` → `imgUrl()` | URL completa |
| Credenciales | `alexg / alexgpass` | `emilys / emilyspass` | `vipuser / vipuser123` · `admin / adminpassword` |
| Hook pedido | `useGames` | `useContenido` / `useMovie` | `useEventos`, `useLogin` |
| Extra | plataforma = buscar en la lista completa | trailer en `<iframe>` | ordenar por fecha · ocultar invitados vacíos |

### HISTORIAL

| | Clima | Paises | Recetas |
|---|---|---|---|
| Puerto | 3000 | 3000 | 3000 |
| `LISTA_KEY` | `"ciudades"` | `"paises"` | `"recetas"` |
| `DETALLE_KEY` | `null` (objeto directo) | `"pais"` | `"receta"` |
| Endpoint lista | `/ciudades` | `/paises` | `/recetas` |
| Detalle | `/ciudades/:id` | `/paises/:cca3` | `/recetas/:id` |
| Ruta React | `/clima/:id` | `/pais/:cca3` | `/recetas/:id` |
| Campo ID | `id` (⚠️ repetido: 3) | `cca3` (string) | `idMeal` (string) |
| Filtros | ninguno (un `<select>` por índice) | `continente`, `idioma`, `buscar` | `categoria`, `area`, `buscar` |
| Opciones | — | `/continentes`, `/idiomas` | `/categorias`, `/areas` |
| localStorage | `historialConsultas` | `paisesRecientes` | `recetasRecientes` |
| Guarda | **objetos** `{id, ciudad, fecha}` | ids | ids |
| Límite | sin límite | **15** | **15** |
| Orden | llegada (push), sin duplicados | más nuevo primero | más nuevo primero |
| Versión plantilla | Context **B**, Recientes **B**, Home **V2** | Context A, Recientes A, Home V1 | Context A, Recientes A, Home V1 |
| Campos con tilde | — | `nombre.común`, `región`, `población` | — |

---

## 5. Trampas (las que más desaprueban)

1. **Export ≠ import**: `export default X` → `import X from` · `export function X` → `import { X } from`.
2. **Router/Provider duplicado o ausente** (`main.jsx` y `App.jsx`): pantalla blanca o error de Router anidado.
3. **`useState`/`useEffect` después de un `return`** (reglas de hooks) → ponelos SIEMPRE arriba.
4. **`fetch` no falla en 404/401** → `if (!res.ok) throw` (ya está en `request`/`apiFetch`).
5. **`useEffect` sin `[]` o con un objeto en deps** → bucle infinito. Usá primitivos: `[id]`, `[filtros.a, filtros.b]`.
6. **Respuesta envuelta**: `curl` primero → `LISTA_KEY` / `DETALLE_KEY`.
7. **El endpoint del esqueleto puede estar MAL** (Clima trae `/clima/:id` y el server tiene `/ciudades/:id`) → el `curl` manda.
8. **Puerto**: TrailerFlix 3001.
9. **`if (loading) return` antes de los filtros** → el input pierde el foco (dejá `Filtros` siempre visible).
10. **`key` única** en cada `.map` (si los ids se repiten, `key={index}`) y **`e.preventDefault()`** en cada form.
11. **Prohibido** (desaprobación automática): `document.getElementById`, `innerHTML`, `addEventListener`, `window.location`, `<a href="x.html">`.

---

## 6. Chequeo final (3 min)

- [ ] `cd react && npm run build` termina bien
- [ ] F12 → Console sin rojos
- [ ] lista → detalle → `/ruta-inventada` (404) → id inexistente (mensaje, no pantalla blanca)
- [ ] Login: malo / bueno / F5 / logout   **o**   Historial: sin duplicados / F5 / límite / limpiar
- [ ] Leí `rubricas.md` punto por punto
