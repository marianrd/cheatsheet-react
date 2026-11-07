import { useState, useEffect } from "react";
import { getCategorias, getAreas } from "../services/api.js";

// Componente controlado: recibe los valores actuales y avisa con onChange(campo, valor).
export function Filtros({ categoria, area, texto, onChange }) {
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);

  // Equivale a loadCategorias() + loadAreas()
  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {});
    getAreas().then(setAreas).catch(() => {});
  }, []);

  return (
    <div className="filters">
      <select
        className="filter-select"
        value={categoria}
        onChange={(e) => onChange("categoria", e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={area}
        onChange={(e) => onChange("area", e.target.value)}
      >
        <option value="">Todas las áreas</option>
        {areas.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <input
        type="text"
        className="search-input"
        placeholder="Buscar receta..."
        value={texto}
        onChange={(e) => onChange("buscar", e.target.value)}
      />
    </div>
  );
}
