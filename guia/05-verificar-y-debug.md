# 05 · Cómo verificar que funciona + errores típicos

## A. Las 5 herramientas de verificación

| Herramienta | Cómo | Para qué |
|---|---|---|
| **Terminal de Vite** (`npm run dev`) | mirala siempre | errores de sintaxis/imports aparecen en rojo acá |
| **`npm run build`** (en `react/`) | termina con `✓ built` | detecta imports rotos, exports que no existen, JSX mal cerrado |
| **Consola del navegador** (F12 → Console) | sin rojos | errores de runtime, warnings de `key`, "Cannot read properties of undefined" |
| **Network** (F12 → Network, filtro Fetch/XHR) | ver requests | ¿se llama al endpoint correcto? ¿status 200/401/404? ¿el body es lo esperado? ¿cuántas veces? |
| **Application → Local Storage** (F12) | ver claves | login/historial persistidos |

Extra: `curl` / `herramientas/check-api.sh` para probar la API sin React.

## B. Si la pantalla queda en blanco

1. Abrí F12 → Console: el error en rojo dice qué archivo y línea.
2. Mirá la terminal de Vite (a veces el error está ahí y no en el navegador).
3. Causas típicas (ordenadas por frecuencia):

| Mensaje | Causa | Arreglo |
|---|---|---|
| `does not provide an export named 'X'` / `X is not exported` | `export function A` pero importás `{ B }`, o `export default` vs `import { }` | igualar nombres. `export function X` ↔ `import { X }`; `export default X` ↔ `import X` |
| `useAuth debe usarse dentro de un AuthProvider` | falta `<AuthProvider>` arriba | ponelo en `main.jsx` / `App.jsx` envolviendo al `Layout` |
| `useNavigate() may be used only in the context of a <Router>` (o `Link`/`useParams`) | falta `<BrowserRouter>` arriba | envolver la app |
| `Cannot read properties of undefined (reading 'map')` | usás `data.map` antes de que llegue | estado inicial `[]` o `if (!data) return ...`; revisá la **forma** de la respuesta (¿viene envuelta?) |
| `Objects are not valid as a React child` | pusiste un objeto en `{ }` (ej. `{error}` o `{pais.nombre}`) | `{error.message}`, `{pais.nombre.común}` |
| `X is not defined` | falta un import | importar (`useState`, `Link`, etc.) |
| `Adjacent JSX elements must be wrapped` | dos raíces en el return | envolver en `<>...</>` |
| `Each child in a list should have a unique "key"` | falta/duplicada `key` en `.map` | `key={item.id}` (único y estable) |
| Pantalla "Cargando..." eterna | `setLoading(false)` nunca corre (olvidaste `finally`) o el fetch falló silencioso | `.finally(() => setLoading(false))`; Network |
| Se llama al API infinitas veces | `useEffect` sin `[]`, o dependencia que cambia en cada render (objeto/función nueva) | poner `[]`/`[id]`; dependencias primitivas; `useCallback` |
| `Failed to fetch` / CORS | server apagado o puerto equivocado | revisar `API_BASE`; ¿terminal del server viva? |
| 404 en `/api/...` | endpoint mal escrito | comparar con `app.get(...)` del server |
| La página recarga al enviar el form | falta `e.preventDefault()` | agregarlo en el `onSubmit` |
| Al recargar `/juegos/3` anda, pero... | (con `npm run dev` anda siempre) | no tocar nada |
| Imágenes rotas | URL relativa (`./posters/1.jpg`) | ver [trampas](06-trampas-de-los-modelos.md) |
| Datos en el detalle son "undefined" | nombre del campo distinto (tildes, mayúsculas) | `console.log(data)` y copiar el nombre exacto |

## C. `console.log` es tu amigo

```jsx
console.log("data:", data);                      // dentro del componente
.then((d) => { console.log("API:", d); ... })    // dentro del fetch
```
Mirá la forma real antes de escribir el JSX.

## D. Prueba manual completa (3 minutos) — la que haría el corrector

**LOGIN:** home → card → detalle → atrás → `/rutaInventada` → login malo → login bueno → F5 → logout.
**HISTORIAL:** home → filtrar/buscar → detalle A → detalle B → detalle A de nuevo → `/recientes` (A y B, sin repetir) → F5 → limpiar → `/rutaInventada`.

## E. Cierre: contra la rúbrica

Abrí `rubricas.md` y para cada línea poné ✔ y *dónde* está en tu código. Las secciones **"Desaprobación automática"** son lo primero:

| Si dice… | Verificá |
|---|---|
| "la app no se puede ejecutar" | `npm run build` OK |
| "no se usa React Router" | `BrowserRouter` + `Routes` + `Link` |
| "no se consume la API / datos hardcodeados" | todo viene de `fetch` a `localhost` |
| "innerHTML / querySelector / getElementById" | buscá en tu código: `grep -rn "document\.\|innerHTML" react/src` → debe dar vacío |
| "EventListeners en lugar de formularios controlados" | `onChange`/`onSubmit` |
| "sin hooks básicos" | `useState` + `useEffect` presentes |
| "copia literal del vanilla" | componentes y estado, no strings HTML |
| "modificar JSON/server/vanilla" | no tocaste `data/`, `server/`, `js/`, `*.html` |

```bash
# desde la carpeta react/
grep -rn "document\.\|innerHTML\|window\.location\|addEventListener" src   # → no debería haber nada
npm run build
```

## F. Si te quedás sin tiempo (prioridad de puntos)

1. Que **compile y corra**. 2. Routing (todas las rutas + 404). 3. Fetch con loading/error en lista y detalle.
4. El Context (login o historial) + localStorage. 5. Custom hooks (`useAuth`, `useXxx`) — es solo envolver `useContext`.
6. Estilo y detalles al final.
