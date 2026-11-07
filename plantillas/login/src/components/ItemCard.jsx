// components/ItemCard.jsx — la card (de retornoCard()/renderXxx() del vanilla).
// Nombres típicos: GameCard · MovieCard/VideoCard · EventoCard
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function ItemCard({ item }) {
  const { user } = useAuth();

  return (
    // 🔧 CAMBIAR: ruta + campo ID. Tiene que coincidir con <Route path="/items/:id"> de App.jsx
    <Link to={`/items/${item.id}`} className="card">
      {/* 🔧 CAMBIAR campos (mirá el JSON). TrailerFlix: <img src={imgUrl(item.poster)} /> (import { imgUrl } from "../api/client.js") */}
      {item.imagen && <img src={item.imagen} alt={item.nombre} />}
      <h3>{item.nombre}</h3>
      <p>{item.descripcion}</p>

      {/* SI PIDEN mostrar algo distinto cuando hay sesión (precio VIP, botón comprar, etc.): */}
      {user && <span>🔧 contenido solo para logueados</span>}

      {/* SI PIDEN "agotado / sin stock": */}
      {item.tickets_disponibles === 0 && <span>Agotado</span>}
    </Link>
  );
}
