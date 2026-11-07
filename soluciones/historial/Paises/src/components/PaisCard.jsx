import { useNavigate } from "react-router-dom";
import { formatPoblacion } from "../utils/formatPoblacion";

// Equivale a la card que arma renderPaises() en app.js
function PaisCard({ pais }) {
  const navigate = useNavigate();

  // OJO con los nombres con tilde del JSON: nombre.común, región, población
  const nombre = pais.nombre?.común || "Sin nombre";
  const region = pais.región || "Sin región";
  const idiomas = Object.values(pais.idiomas || {}).join(", ") || "Sin idiomas";
  const bandera = pais.banderas?.png;

  const handleClick = () => navigate(`/pais/${pais.cca3}`); // reemplaza onclick="showDetalle(...)"

  return (
    <div className="pais-card" onClick={handleClick}>
      <img src={bandera} alt={nombre} />
      <div className="pais-card-content">
        <h3>{nombre}</h3>
        <div className="pais-meta">
          <span>🌍 {region}</span>
          <span>🗣️ {idiomas}</span>
          <span>👥 {formatPoblacion(pais.población)}</span>
        </div>
      </div>
    </div>
  );
}

export default PaisCard;
