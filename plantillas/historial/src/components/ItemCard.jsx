// components/ItemCard.jsx — la "card" del catálogo. Se reusa en Home Y en Recientes.
// Sale de la función retornoCard()/renderXxx() del vanilla: copiá sus campos acá.
import { Link } from "react-router-dom";

function ItemCard({ item }) {
  // 🔧 CAMBIAR los campos. Mirá el JSON real (curl). OJO con las TILDES del JSON:
  //    pais.nombre?.común · pais.región · pais.población · juego.año  -> se escriben con tilde.
  //    Anidados: usá ?. (item.nombre?.común) para que no explote si falta.
  //    Objeto con idiomas: Object.values(item.idiomas || {}).join(", ")
  //    Array: (item.invitados || []).join(", ")
  const titulo = item.nombre;
  const imagen = item.imagen;
  const subtitulo = item.categoria;

  return (
    // 🔧 CAMBIAR: ruta + campo ID  (item.id · item.cca3 · item.idMeal)
    <Link to={`/items/${item.id}`} className="card">
      {imagen && <img src={imagen} alt={titulo} />}
      <h3>{titulo}</h3>
      <p>{subtitulo}</p>
      {/* SI hay un número para formatear: {Number(item.poblacion).toLocaleString("es-AR")} */}
      {/* SI un campo puede faltar: {item.campo && <span>{item.campo}</span>} */}
    </Link>
  );
}

export default ItemCard;
