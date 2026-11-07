# 01 · Paso a paso para resolver el parcial

Tiempo orientativo para un parcial de ~2-3 hs. Si te trabás más de 10 min en algo, pasá al siguiente paso y volvé.

---

## FASE 0 — Leer (5 min)

1. Abrí **`README.md`** (o `readme.md`) del examen → mirá la sección *"Qué debe tener tu app React"*: ahí están las **rutas** y los **hooks/contextos** que piden.
2. Abrí **`rubricas.md`** → es **lo que te corrigen**. Pegalo al lado. Cada ítem es puntos.
3. Decidí el tipo:
   - Menciona **login / AuthContext / `POST /api/login`** → tipo **LOGIN** → [`03-tipo-login.md`](03-tipo-login.md)
   - Menciona **historial / recientes / localStorage / Context de consultas** → tipo **HISTORIAL** → [`04-tipo-historial.md`](04-tipo-historial.md)
4. Anotá las **rutas** exigidas. Ejemplos de los modelos:
   - GameHub `/` y `/juegos/:id` · TrailerFlix `/` y `/peliculas/:id` · Eventos `/` y `/eventos/:id`
   - Clima `/`, `/clima/:id`, `/recientes` · Paises `/`, `/pais/:cca3`, `/recientes` · Recetas `/`, `/recetas/:id`, `/recientes`

---

## FASE 1 — Levantar todo (5 min)

Abrí **2 terminales** (3 con una para pruebas).

**Terminal 1 — API (Express):**
```bash
cd server
npm install
npm start          # o: npm run dev   (mirá "scripts" en server/package.json)
```
Tiene que decir algo como `escuchando en http://localhost:3000` (o **3001** en TrailerFlix → mirá el puerto en `server/*.js`).

**Terminal 2 — React:**
```bash
cd react
npm install
npm run dev        # abre http://localhost:5173
```

**Probá que la API responde** (esto es lo más importante de la fase):
```bash
curl http://localhost:3000/api/<endpoint>        # o pegalo en el navegador
```
Los endpoints los sacás de `server/*.js` (buscá `app.get(` y `app.post(`). Usá `herramientas/check-api.sh`.

> 👀 **Ver el vanilla funcionando** (para comparar): GameHub y TrailerFlix → abrí `http://localhost:3000` / `:3001` (el Express sirve el HTML).
> Clima/Paises/Recetas/Eventos → en la raíz del examen: `python3 -m http.server 8080` y abrí `http://localhost:8080` (el server de la API tiene que estar prendido igual).

---

## FASE 2 — Hacer el "inventario" del vanilla (10 min) ← la parte que más rinde

Completá esta tabla leyendo `js/*.js` + `server/*.js`. Es literalmente tu lista de tareas.

| Pregunta | Dónde mirar | Ejemplo (Paises) |
|---|---|---|
| ¿Base URL y puerto? | `const URL / API_BASE` en `js/*.js` | `http://localhost:3000/api` |
| ¿Endpoints que se usan? | `fetch(...)` en `js/*.js` | `/paises`, `/paises/:cca3`, `/continentes`, `/idiomas` |
| ¿Forma de la respuesta? | `curl` o `server/*.js` (`res.json(...)`) | `{ success, paises: [...] }` (envuelta) |
| ¿Es array, objeto, o objeto agrupado? | idem | GameHub: `{PC:[..],Xbox:[..]}` · TrailerFlix: `[..]` |
| ¿Qué campo es el ID y de qué tipo? | JSON / server | Paises `cca3` (string) · Recetas `idMeal` (string) · resto `id` (number) |
| ¿Campos que muestra la **card**? | función `retornoCard` / `renderXxx` | nombre, región, idiomas, población, bandera |
| ¿Campos del **detalle**? | `js/juego.js` / `evento.js` / `renderDetalle` | ... |
| ¿Clave(s) de `localStorage`? | `localStorage.setItem(` | `paisesRecientes` |
| ¿Qué guarda y cómo? (push/unshift, límite, duplicados) | `addToRecientes` / `guardarEnHistorial` | `unshift`, sin duplicados, máx 15 |
| ¿Qué devuelve el login? | `server` `/api/login` + `js/login.js` | `{ok, username}` vs usuario completo |

---

## FASE 3 — Construir en este orden (60-90 min)

Cada paso se prueba en el navegador antes de seguir.

| # | Archivo | Qué hacer | ✅ Cómo verificar |
|---|---|---|---|
| 1 | `src/main.jsx` | `BrowserRouter` (+ Provider del contexto) envolviendo `<App/>` | la página carga sin pantalla blanca |
| 2 | `src/api/client.js` o `src/services/api.js` | Función(es) de fetch con la base URL correcta | en consola del navegador: llamarla y ver datos |
| 3 | hook de lista (`useGames`, `useContenido`…) o `useEffect` en la página | `data / loading / error` | `console.log(data)` muestra lo esperado |
| 4 | componente **Card** | JSX de la tarjeta (desde `retornoCard` del vanilla) | se ve 1 card con datos reales |
| 5 | **HomePage** | `.map()` de cards + loading/error/vacío | se ve el catálogo completo |
| 6 | `src/App.jsx` | `<Routes>` con **todas** las rutas + `path="*"` (404) | navegar a `/xyz` → 404 |
| 7 | **Página de detalle** | `useParams` + `useEffect([id])` + loading/error/no encontrado | click en card → detalle; `/ruta/9999` → "no encontrado" |
| 8 | **Context** (Auth o Historial) + hook `useXxx` | ver [03](03-tipo-login.md) / [04](04-tipo-historial.md) | ver checklist de cada tipo |
| 9 | Layout / Header / Recientes / LoginForm | lo que falte | idem |
| 10 | Repaso con `rubricas.md` | tildar cada punto | ver [05](05-verificar-y-debug.md) |

**Orden mental:** *datos → una card → lista → rutas → detalle → contexto → extras.*
Nunca empieces por el login/contexto con la lista sin funcionar.

---

## FASE 4 — Repaso final (10 min)

- [ ] `npm run build` en `react/` termina sin errores (es el mejor detector de errores de sintaxis/imports).
- [ ] Consola del navegador (F12) sin errores rojos.
- [ ] Recorrida completa: home → detalle → volver → 404 → (login/logout | recientes → limpiar).
- [ ] Recargar la página (F5) en cada ruta: sigue andando. (Persistencia del login/historial.)
- [ ] No quedó `document.getElementById`, `innerHTML`, `window.location.href`, `<a href="x.html">`.
- [ ] Cada punto de `rubricas.md` tiene su cosa hecha (la sección 6 "desaprobación automática" es la que más importa).
- [ ] Archivos sobrantes del esqueleto (ej. `GameCard.jsx` en Recetas) borrados o al menos sin imports rotos.
