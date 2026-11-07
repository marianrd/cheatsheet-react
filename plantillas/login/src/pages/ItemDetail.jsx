// ═══════════════════════════════════════════════════════════════════
// pages/ItemDetail.jsx (PLANTILLA LOGIN) — detalle. Equivale a juego.js / evento.js / pelicula.js.
// Tres estados de la UI: cargando · error · no encontrado (404) · dato.
// ═══════════════════════════════════════════════════════════════════
import { useParams, Link } from "react-router-dom";
import { useItem } from "../hooks/useItems.js";
import { useAuth } from "../hooks/useAuth.js";

// ⚠️ El nombre del export tiene que ser EL MISMO que importa App.jsx
//    (los esqueletos traen "GameDetailPage" copiado en TrailerFlix y Eventos -> no compila).
export function ItemDetail() {
  const { id } = useParams(); // ⚠️ "id" = lo que sigue a ":" en <Route path="/items/:id">
  const { item, loading, error } = useItem(id);
  const { user } = useAuth();

  if (loading) return <section className="status"><h2>⏳ Cargando...</h2></section>;
  if (error) {
    return (
      <section className="status">
        <h2>❌ Error al cargar los detalles</h2>
        <p>{error.message}</p>
      </section>
    );
  }
  if (!item) {
    return (
      <section className="status">
        <h2>❌ No encontrado</h2>
        <Link to="/">Volver al catálogo</Link>
      </section>
    );
  }

  // Datos opcionales con valor por defecto, para no romper si faltan (la rúbrica pide "validaciones nulas")
  const invitados = item.invitados || [];

  return (
    <section>
      <Link to="/">← Volver al catálogo</Link>

      {/* 🔧 CAMBIAR campos (copiá del detalle del vanilla). TILDES: item.año */}
      <h1>{item.nombre}</h1>
      {item.imagen && <img src={item.imagen} alt={item.nombre} />}
      <p>{item.descripcion}</p>
      <p>Precio: ${item.precio}</p>

      {/* Render condicional de listas vacías */}
      {invitados.length > 0 ? (
        <ul>{invitados.map((x) => <li key={x}>{x}</li>)}</ul>
      ) : (
        <p>Sin invitados confirmados</p>
      )}

      {/* SI hay video (TrailerFlix): validar que exista antes de renderizar el iframe */}
      {item.trailer && (
        <iframe width="560" height="315" src={item.trailer} title={item.nombre} allowFullScreen />
      )}

      {/* SI piden algo distinto según la sesión (VIP, comprar...): */}
      {user && <button>🔧 Acción solo para logueados</button>}
      {user?.rol === "vip" && <p>🔧 Contenido VIP</p>}
    </section>
  );
}
