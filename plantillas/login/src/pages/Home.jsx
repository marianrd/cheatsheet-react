// ═══════════════════════════════════════════════════════════════════
// pages/Home.jsx (PLANTILLA LOGIN) — catálogo. Equivale a js/app.js del vanilla.
// VERSIÓN 1 (esta)  : lista plana (Eventos, TrailerFlix)
// VERSIÓN 2 (abajo) : lista AGRUPADA { PC:[..], Xbox:[..] } (GameHub)
// ═══════════════════════════════════════════════════════════════════
import { useItems } from "../hooks/useItems.js";
import { ItemCard } from "../components/ItemCard.jsx";

export function Home() {
  const { items, loading, error } = useItems();

  if (loading) return <section className="status"><h2>⏳ Cargando...</h2></section>;
  if (error) {
    return (
      <section className="status">
        <h2>⚠️ Error al cargar</h2>
        <p>{error.message}</p>
      </section>
    );
  }

  // SI PIDEN ordenar (ej. por fecha de llegada / alfabético / precio):
  // const ordenados = [...items].sort((a, b) => a.fecha.localeCompare(b.fecha));   // texto/fecha ISO
  // const ordenados = [...items].sort((a, b) => a.precio - b.precio);              // número
  //   ⚠️ [...items] copia: sort() sin copiar MUTA el estado.  Y usá `ordenados` en el .map de abajo.
  // SI PIDEN buscador local: const [q, setQ] = useState(""); items.filter(i => i.nombre.toLowerCase().includes(q.toLowerCase()))

  return (
    <section>
      <h1>🔧 Título del catálogo</h1>

      {items.length === 0 ? (
        <p className="status">No hay resultados.</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            // 🔧 key = ID único
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VERSIÓN 2 — AGRUPADA (GameHub). En useItems.js: useState(null) en vez de []. Home:
// ═══════════════════════════════════════════════════════════════════
//
// const GRUPOS = ["PC", "PlayStation", "Xbox", "Nintendo"];   // 🔧 las claves del JSON
//
// export function Home() {
//   const { items, loading, error } = useItems();   // items = { PC: [...], Xbox: [...] }
//   if (loading) ...; if (error) ...;
//   if (!items || typeof items !== "object") return <p>Sin datos</p>;
//
//   const gruposConItems = GRUPOS.filter((g) => items[g] && items[g].length > 0);
//   // o dinámico: Object.keys(items)
//
//   return (
//     <section>
//       {gruposConItems.map((g) => (
//         <section key={g}>
//           <h2>{g}</h2>
//           <div className="grid">
//             {items[g].map((item) => <ItemCard key={item.id} item={item} platform={g} />)}
//           </div>
//         </section>
//       ))}
//     </section>
//   );
// }
// El detalle en GameHub: para saber la plataforma hay que bajar TODO (apiFetch("/videojuegos")) y
//   Object.entries(todos).find(([, lista]) => lista.some(v => v.id === juego.id))
