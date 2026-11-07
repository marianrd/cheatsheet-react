# 📘 Cheatsheet React — parcial "HTML/JS vanilla → React"

Armado a partir de los 6 modelos que tenés (`Examen-React-*`). Todo lo que hay acá está **probado**:
las 6 soluciones compilan y pasan un test en Chrome real (rutas, fetch, login, historial, localStorage, 404).

## Los 2 tipos de parcial

| Tipo | Modelos | Qué lo distingue |
|---|---|---|
| **LOGIN** | GameHub, TrailerFlix, Eventos | Formulario usuario/contraseña, `POST /api/login`, `AuthContext`, catálogo + detalle |
| **HISTORIAL** | Clima, Paises, Recetas | Lista de "recientes/consultas" guardada en `localStorage` con un `Context`, filtros/selector + detalle |

> Los dos comparten el 80%: **Router + fetch con loading/error + lista + detalle + 404 + un Context**.
> Cambia solo cuál es el Context (sesión vs. historial).

## Cómo usar esto mañana (orden de lectura)

1. 🔥 [`guia/01-paso-a-paso.md`](guia/01-paso-a-paso.md) — el procedimiento completo, minuto a minuto. **Seguilo en orden.**
2. 🔁 [`guia/02-de-vanilla-a-react.md`](guia/02-de-vanilla-a-react.md) — tabla: "esto del vanilla → esto en React" y **de qué archivo sacás cada cosa**.
3. 🔐 [`guia/03-tipo-login.md`](guia/03-tipo-login.md) o 🕘 [`guia/04-tipo-historial.md`](guia/04-tipo-historial.md) — código para copiar, según el tipo.
4. ✅ [`guia/05-verificar-y-debug.md`](guia/05-verificar-y-debug.md) — cómo comprobar que anda + errores típicos y su solución.
5. ⚠️ [`guia/06-trampas-de-los-modelos.md`](guia/06-trampas-de-los-modelos.md) — bugs reales que tienen los esqueletos que te dan (¡leelo!).
6. 📄 [`CHEATSHEET-1-HOJA.md`](CHEATSHEET-1-HOJA.md) — todo condensado en una hoja.
7. 🧠 [`guia/00-react-minimo.md`](guia/00-react-minimo.md) — si algo de React no te cierra, 10 minutos de lo mínimo.

## Soluciones resueltas (para copiar y pegar)

`soluciones/login/{GameHub,TrailerFlix,Eventos}/src/` y `soluciones/historial/{Clima,Paises,Recetas}/src/`
→ cada una es el `src/` completo y funcionando. Ver [`soluciones/README.md`](soluciones/README.md).

Si el parcial es **nuevo** (otro tema: libros, autos, etc.), agarrá la solución del mismo tipo y cambiá nombres/campos.

## Herramientas

- `herramientas/check-api.sh` — prueba los endpoints del server con curl y te muestra la forma de la respuesta.

## Las 8 reglas de oro

1. **Primero** levantá el server y mirá qué devuelve la API (curl/navegador). Los nombres de campos del JSON mandan.
2. **Compilar > todo.** Si Vite no compila te desaprueban automático. Probá en el navegador cada 10 minutos.
3. **Nada de `document.getElementById`, `innerHTML`, `addEventListener`** en React (desaprobación automática).
4. **Todo fetch** va dentro de `useEffect` y con 3 estados: `data`, `loading`, `error`.
5. **Nombre del export = nombre del import** (los esqueletos tienen este bug, ver trampas).
6. **Provider arriba de todo** lo que use el contexto, y `BrowserRouter` arriba de todo lo que use `Link`.
7. `key={...}` en cada `.map()`.
8. Guardá en git/copiá el archivo cuando algo ande. Un commit = punto de retorno.
