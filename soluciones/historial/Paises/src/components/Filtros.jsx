import { useState, useEffect } from "react";
import { getContinentes, getIdiomas } from "../services/api";

// Componente CONTROLADO: los valores viven en Home (prop `filtros`);
// acá solo se cargan las opciones de los <select> y se avisa cada cambio.
function Filtros({ filtros, onFilterChange }) {
  const [continentes, setContinentes] = useState([]);
  const [idiomas, setIdiomas] = useState([]);

  // Equivale a loadContinentes() + loadIdiomas() del vanilla
  useEffect(() => {
    getContinentes().then(setContinentes).catch(() => {});
    getIdiomas().then(setIdiomas).catch(() => {});
  }, []);

  // Copia los filtros actuales y pisa solo el campo que cambió
  const cambiar = (campo, valor) => onFilterChange({ ...filtros, [campo]: valor });

  return (
    <div className="filters">
      <select
        className="filter-select"
        value={filtros.continente}
        onChange={(e) => cambiar("continente", e.target.value)}
      >
        <option value="">Todos los continentes</option>
        {continentes.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filtros.idioma}
        onChange={(e) => cambiar("idioma", e.target.value)}
      >
        <option value="">Todos los idiomas</option>
        {idiomas.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>

      <input
        type="text"
        className="search-input"
        placeholder="Buscar país..."
        value={filtros.buscar}
        onChange={(e) => cambiar("buscar", e.target.value)}
      />
    </div>
  );
}

export default Filtros;
