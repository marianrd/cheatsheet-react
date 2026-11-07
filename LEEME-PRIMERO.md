# 🆘 LEEME PRIMERO — práctica con los 6 modelos

> ⚠️ Esto sirve para **practicar** con los 6 modelos que ya tenés. Para un parcial **nuevo** (o si te piden hacerlo a mano) usá [`guia/00-EMPEZAR-ACA.md`](guia/00-EMPEZAR-ACA.md): explica cada pieza desde cero.

No tenés que entender React para empezar. Seguí estos pasos **en orden**, copiando y pegando.
Si te trabás, andá directo a la sección **"Si algo sale mal"** al final.

> 📍 Esta carpeta está en: `~/Documents/modelos-react/cheatsheet-react`
> En el examen, si no tenés esa ruta, reemplazala por donde hayas copiado el repo (o cloná: `git clone https://github.com/marianrd/cheatsheet-react`).

---

## PASO 1 — Abrí una terminal EN LA CARPETA DEL EXAMEN

La carpeta del examen es la que tiene adentro `server/`, `react/`, `js/`, `rubricas.md`.
```bash
cd /ruta/del/examen
ls            # tenés que ver: server  react  js  rubricas.md ...
```

## PASO 2 — ¿Cuál parcial es? (mirá el título del `README.md` o `rubricas.md`)

| Si dice… | Escribí este nombre |
|---|---|
| React **GameHub** (videojuegos) | `GameHub` |
| React **TrailerFlix** (películas) | `TrailerFlix` |
| React **Eventos** / EventShow (conciertos) | `Eventos` |
| React **Clima** (ciudades) | `Clima` |
| React **Atlas Países** | `Paises` |
| React **Recetas** (recetario) | `Recetas` |
| **Otro tema distinto** (libros, autos, etc.) | → andá a **"PARCIAL NUEVO"** abajo |

## PASO 3 — UN solo comando (copia la solución e instala todo)

Cambiá `Paises` por el nombre de la tabla:
```bash
bash ~/Documents/modelos-react/cheatsheet-react/herramientas/aplicar-solucion.sh Paises
```
Tarda 1-2 minutos (instala). Al final te imprime qué hacer. Es esto:

## PASO 4 — Prender las dos cosas (2 terminales)

**Terminal 1** (la API — dejala abierta):
```bash
cd server
npm start
```
**Terminal 2** (la app — dejala abierta):
```bash
cd react
npm run dev
```
Abrí en el navegador: **http://localhost:5173**

## PASO 5 — Probar que anda (2 minutos)

**Si es de LOGIN** (GameHub / TrailerFlix / Eventos):
- [ ] Se ve el catálogo con imágenes
- [ ] Click en una tarjeta → se ve el detalle
- [ ] Probá una ruta inventada: `http://localhost:5173/asdf` → dice 404
- [ ] Login: usuario/contraseña de abajo → aparece "Bienvenido"
- [ ] Apretá F5 → sigue logueado · "Cerrar sesión" → vuelve el formulario

| Modelo | Usuario | Contraseña |
|---|---|---|
| GameHub | `alexg` | `alexgpass` |
| TrailerFlix | `emilys` | `emilyspass` |
| Eventos | `vipuser` | `vipuser123` |

**Si es de HISTORIAL** (Clima / Paises / Recetas):
- [ ] Se ve la lista / el selector con datos
- [ ] Entrá a un ítem → detalle. Entrá a otro. Volvé al primero.
- [ ] Pestaña "Recientes" → aparecen **sin repetirse**
- [ ] F5 en Recientes → siguen ahí · botón limpiar → se vacía
- [ ] Ruta inventada → 404

Para ver errores: apretá **F12** en el navegador → pestaña **Console**. Tiene que estar sin rojos.

## PASO 6 — Antes de entregar

```bash
cd react
rm -rf src.original-*        # borra el backup que hizo el script
npm run build                # tiene que terminar con "built in ..." (sin errores)
```
Después, abrí `rubricas.md` y fijate que cada punto esté cubierto (la guía `guia/05-verificar-y-debug.md` tiene la tabla).

---

# 🆕 PARCIAL NUEVO (otro tema)

Esto es lo difícil, así que andá de a poco. La idea: **copiar un modelo del mismo tipo y cambiar los nombres**.

**A.** Leé el `README.md` del examen: ¿pide login o historial/recientes?
- Login → usá de base **GameHub** (si la API devuelve un objeto agrupado) o **Eventos** (si devuelve una lista simple).
- Historial → usá de base **Paises** (con filtros) o **Clima** (sin filtros, con selector).

**B.** Corré el paso 3 con ese modelo base (ej. `Eventos`) dentro del examen nuevo.

**C.** Mirá qué devuelve TU API (con el server prendido), cambiando el endpoint:
```bash
bash ~/Documents/modelos-react/cheatsheet-react/herramientas/check-api.sh http://localhost:3000/api/LOQUESEA
```
Te muestra los campos. Anotalos.

**D.** Cambiá estas 5 cosas (con "buscar y reemplazar" del editor, Ctrl+Shift+H en VS Code):

| # | Qué cambiar | Dónde |
|---|---|---|
| 1 | La URL base/puerto y el endpoint (`/eventos` → `/lo-que-sea`) | `src/api/client.js` o `src/services/api.js`, y `src/hooks/use*.js` |
| 2 | Los **campos** que muestra la tarjeta (`evento.artista` → `item.autor`) | `src/components/*Card.jsx` |
| 3 | Los campos del detalle | `src/pages/*Detail*.jsx` |
| 4 | Las **rutas** (`/eventos/:id` → `/libros/:id`) | `src/App.jsx` **y** el `Link to=` de la tarjeta |
| 5 | (historial) la **clave de localStorage** y el campo ID | `src/context/*Context.jsx` y el detalle |

**E.** Después de cada cambio, mirá el navegador. Si se rompe, deshacé ese último cambio (Ctrl+Z).

Si querés entender cada pieza: `guia/03-tipo-login.md` o `guia/04-tipo-historial.md` (tienen una tabla "Qué cambiar para otro tema").

---

# 🔧 SI ALGO SALE MAL

| Qué ves | Qué hacer |
|---|---|
| El comando dice `no veo las carpetas react/ y server/` | No estás en la carpeta del examen. Hacé `ls` y `cd` hasta verlas. |
| Pantalla en blanco | F12 → Console → leé el error rojo. Buscalo en `guia/05-verificar-y-debug.md` (tabla "Si la pantalla queda en blanco"). |
| "Failed to fetch" / no carga datos | La **Terminal 1** (`npm start` del server) se cerró o dio error. Volvé a prenderla. |
| `EADDRINUSE` / puerto ocupado | Algo ya usa ese puerto: `ss -ltnp \| grep 3000` y cerrá eso (o reiniciá la terminal vieja del server). |
| `npm: command not found` | No tenés Node en esa compu. Avisale al docente. |
| Quedó todo roto y querés volver atrás | `rm -rf react/src && mv react/src.original-* react/src` |
| Las imágenes no se ven en TrailerFlix | El server de TrailerFlix tiene que estar prendido en el puerto 3001 (lo sirve él). |

---

# ⏱️ Si te queda poco tiempo

1. Que **compile** y se vea algo (`npm run dev` sin errores).
2. Que las **rutas** anden (lista → detalle → 404).
3. Que el **login** o el **historial** funcione y se guarde (F5).
4. Todo lo demás es estética.

> ⚠️ Una cosa honesta: las soluciones son mías, no del docente. Si el parcial es **exactamente** uno de los 6 modelos, esto debería andar casi sin cambios. Si es un tema nuevo, vas a tener que adaptar (Paso "PARCIAL NUEVO"), y ahí ayuda mucho leer la tabla "Qué cambiar" de las guías 03/04. Y **leé siempre `rubricas.md`**: es lo que te corrigen.
