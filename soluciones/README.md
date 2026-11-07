# Soluciones resueltas

Cada carpeta es un `src/` **completo** de la app React para ese modelo.
Verificado: compila con Vite y pasa un test automático en Chrome (rutas, fetch, login/historial, localStorage, 404, sin errores de consola).

| Carpeta | Tipo | Rutas | Qué la hace distinta |
|---|---|---|---|
| `login/GameHub` | LOGIN | `/`, `/juegos/:id` | API agrupada por plataforma; login devuelve usuario con `rol`; `login(userData)` en el contexto |
| `login/TrailerFlix` | LOGIN | `/`, `/peliculas/:id` | puerto **3001**; agrupa por género en el cliente; `posterUrl()`; login `{ok, username}`; iframe de trailer |
| `login/Eventos` | LOGIN | `/`, `/eventos/:id` | hooks `useEventos`/`useEvento`/`useLogin`; render condicional (tickets bajos, invitados vacíos) |
| `historial/Clima` | HISTORIAL | `/`, `/clima/:id`, `/recientes` | historial de objetos `{id,ciudad,fecha}`; selector dinámico; ids repetidos en datos |
| `historial/Paises` | HISTORIAL | `/`, `/pais/:cca3`, `/recientes` | filtros + búsqueda con **debounce**; recientes = ids, máx 15; `Promise.allSettled` |
| `historial/Recetas` | HISTORIAL | `/`, `/recetas/:id`, `/recientes` | filtros en **query string** (`useSearchParams`); iframe YouTube validado; ingredientes 1..20 |

## Cómo usar una solución en un examen

```bash
# desde la raíz del examen (donde están server/ y react/)
cp -r /ruta/a/cheatsheet-react/soluciones/historial/Paises/src/. react/src/
cd react && npm install && npm run dev
```
- `cp -r ... src/.` **pisa** archivos con el mismo nombre y agrega los nuevos. Revisá que no queden archivos viejos del esqueleto con imports rotos (ej. `GameCard.jsx` en TrailerFlix: borralo).
- Solo `index.css`: las soluciones de LOGIN y Clima/Paises **no** lo incluyen (usan el del esqueleto). La de Recetas sí (es el CSS del vanilla + 4 líneas).
- Para un examen **nuevo del mismo tipo**: copiá la solución, y cambiá según las tablas "Qué cambiar" de las guías 03/04.

## Si no podés copiar archivos enteros

Abrí la guía del tipo ([03](../guia/03-tipo-login.md) / [04](../guia/04-tipo-historial.md)): tiene cada pieza con comentarios `← CAMBIAR`.
