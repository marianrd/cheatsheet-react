// ═══════════════════════════════════════════════════════════════════
// pages/Home.jsx  (PLANTILLA HISTORIAL) — catálogo con filtros + debounce
// Equivale a loadXxx()/renderXxx() del vanilla (DOMContentLoaded + listeners).
//
// ELEGÍ UNA VERSIÓN según el enunciado:
//   VERSIÓN 1 (esta) : lista de cards + filtros (selects + buscador)      -> Paises, Recetas
//   VERSIÓN 2 (abajo): UN <select> con las opciones + botón "Consultar"   -> Clima
//   VERSIÓN 3        : lista simple sin filtros -> borrá <Filtros/>, el estado `filtros`
//                      y pasá getItems() sin argumentos.
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import Filtros from "../components/Filtros.jsx";
import ItemCard from "../components/ItemCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { getItems } from "../services/api.js";
import { useDebounce } from "../hooks/useDebounce.js";

function Home() {
  // 🔧 Los nombres de las claves = los QUERY PARAMS que acepta la API (mirá server/*.js: req.query.xxx)
  const [filtros, setFiltros] = useState({ categoria: "", area: "", buscar: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // El texto se "retrasa": no se pide al server en cada tecla.
  // SI NO PIDEN debounce: usá filtros.buscar directo y borrá esta línea y el import.
  const buscarRetrasado = useDebounce(filtros.buscar, 500);

  const handleChange = (campo, valor) => setFiltros((prev) => ({ ...prev, [campo]: valor }));

  useEffect(() => {
    let cancelled = false; // evita que una respuesta vieja pise a una nueva
    setLoading(true);
    setError(null);

    getItems({ categoria: filtros.categoria, area: filtros.area, buscar: buscarRetrasado })
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { if (!cancelled) setError("Error al cargar. ¿Está prendido el servidor?"); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // ⚠️ Dependencias = valores PRIMITIVOS (strings). NUNCA el objeto `filtros` entero -> bucle infinito.
  }, [filtros.categoria, filtros.area, buscarRetrasado]);

  // SI PIDEN ordenar:  const ordenados = [...items].sort((a, b) => a.nombre.localeCompare(b.nombre));
  //   por número:      [...items].sort((a, b) => b.precio - a.precio)    (mayor a menor)
  // SI PIDEN filtrar en el cliente (la API no filtra):
  //   const visibles = items.filter((i) => i.nombre.toLowerCase().includes(filtros.buscar.toLowerCase()));
  // SI PIDEN paginar / "mostrar más":  const [cuantos, setCuantos] = useState(12);
  //   items.slice(0, cuantos)  y  <button onClick={() => setCuantos(c => c + 12)}>Ver más</button>

  return (
    <div className="home">
      <div className="container">
        {/* ⚠️ Filtros SIEMPRE visible: si lo ocultás con un `if (loading) return`, el input pierde el foco al tipear */}
        <Filtros filtros={filtros} onChange={handleChange} />

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && items.length === 0 && <p className="empty-message">Sin resultados.</p>}

        {!loading && !error && (
          <div className="grid">
            {items.map((item) => (
              // 🔧 key = campo ID único (item.id · item.cca3 · item.idMeal)
              // ⚠️ SI los ids se REPITEN en el JSON (Clima: id 3 dos veces): key={index}
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

// ═══════════════════════════════════════════════════════════════════
// VERSIÓN 2 — UN <select> + botón (Clima). Reemplazá TODO lo de arriba por esto:
// ═══════════════════════════════════════════════════════════════════
//
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Loading from "../components/Loading.jsx";
// import ErrorMessage from "../components/ErrorMessage.jsx";
// import { getItems } from "../services/api.js";
//
// function Home() {
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const [seleccion, setSeleccion] = useState("0");   // ⚠️ TODOS los useState ARRIBA de cualquier return
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     getItems().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
//   }, []);
//
//   const handleSubmit = (e) => {
//     e.preventDefault();                               // ⚠️ siempre en un form
//     const item = items[Number(seleccion)];            // el value del option es el ÍNDICE
//     if (item) navigate(`/items/${item.id}`);          // 🔧 ruta + campo id
//   };
//
//   if (loading) return <Loading />;
//   if (error) return <ErrorMessage message={error} />;
//
//   return (
//     <form onSubmit={handleSubmit}>
//       <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
//         {items.map((item, index) => (
//           <option key={index} value={index}>{item.nombre}</option>   // key/value = índice (ids repetidos)
//         ))}
//       </select>
//       <button type="submit">Consultar</button>
//     </form>
//   );
// }
// export default Home;
//
// SI además piden mostrar el historial en Home: poné <Recientes /> o la lista debajo del form.
