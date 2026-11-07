import { Link } from "react-router-dom";

// Equivale a la card de renderRecetas() en app.js.
// <Link> reemplaza al onclick="showDetalle(id)"
export function RecetaCard({ receta }) {
  return (
    <Link to={`/recetas/${receta.idMeal}`} className="receta-card">
      <img src={receta.strMealThumb} alt={receta.strMeal} />
      <div className="receta-card-content">
        <h3>{receta.strMeal}</h3>
        <div className="receta-meta">
          <span>📁 {receta.strCategory || "Sin categoría"}</span>
          <span>🌍 {receta.strArea || "Sin área"}</span>
        </div>
      </div>
    </Link>
  );
}
