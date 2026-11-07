// ═══════════════════════════════════════════════════════════════════
// pages/Recientes.jsx (PLANTILLA HISTORIAL)
// ELEGÍ según lo que guarda el Context:
//   VARIANTE A (esta)  : el Context guarda IDS  -> hay que pedir cada uno al API (Paises, Recetas)
//   VARIANTE B (abajo) : el Context guarda OBJETOS { id, nombre, fecha } -> se muestran directo (Clima)
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard.jsx";
import Loading from "../components/Loading.jsx";
import { getItem } from "../services/api.js";
import { useItemsRecientes } from "../hooks/useItemsRecientes.js";

function Recientes() {
  const { recientes, limpiarRecientes } = useItemsRecientes();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (recientes.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // allSettled: si un id falla (404), los demás igual se muestran. Pide todo en PARALELO.
    Promise.allSettled(recientes.map((id) => getItem(id))).then((resultados) => {
      if (cancelled) return;
      setItems(resultados.filter((r) => r.status === "fulfilled").map((r) => r.value));
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [recientes]);

  return (
    <div className="recientes">
      <div className="container">
        <h2 className="page-title">Recientes</h2>

        {loading && <Loading />}

        {!loading && items.length === 0 && <p className="empty-message">Todavía no viste nada.</p>}

        {!loading && items.length > 0 && (
          <>
            <div className="grid">
              {items.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
            <button onClick={limpiarRecientes}>🗑️ Limpiar recientes</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Recientes;

// ═══════════════════════════════════════════════════════════════════
// VARIANTE B — Context guarda OBJETOS { id, nombre, fecha } (Clima). Reemplazá todo por:
// ═══════════════════════════════════════════════════════════════════
//
// import { Link } from "react-router-dom";
// import { useItemsRecientes } from "../hooks/useItemsRecientes.js";
//
// function Recientes() {
//   const { recientes, limpiarRecientes } = useItemsRecientes();
//   return (
//     <div className="recientes">
//       <div className="container">
//         <h2 className="page-title">Consultas Recientes</h2>
//         {recientes.length === 0 ? (
//           <p className="empty-message">Todavía no consultaste nada.</p>
//         ) : (
//           <ul>
//             {recientes.map((r) => (
//               <li key={r.id}>
//                 <Link to={`/items/${r.id}`}>📍 {r.nombre} - 🕒 {r.fecha}</Link>
//               </li>
//             ))}
//           </ul>
//         )}
//         {recientes.length > 0 && <button onClick={limpiarRecientes}>🗑️ Limpiar historial</button>}
//       </div>
//     </div>
//   );
// }
// export default Recientes;
//
// SI piden mostrar el historial también en Home/Detalle: sacá la <ul> a components/HistorialLista.jsx
// y usala en las tres páginas.
