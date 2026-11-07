// components/Filtros.jsx — componente CONTROLADO: los valores viven en Home (prop `filtros`);
// acá solo se cargan las opciones de los <select> y se avisa cada cambio con onChange(campo, valor).
// SI NO PIDEN filtros desplegables: borrá este archivo y sacá <Filtros/> de Home.
// SI PIDEN solo buscador de texto: dejá solo el <input>.
// SI PIDEN UN solo select: borrá el otro bloque <select> y su useState/getOpciones.
import { useState, useEffect } from "react";
import { getOpciones } from "../services/api.js";

function Filtros({ filtros, onChange }) {
  const [opcionesA, setOpcionesA] = useState([]);
  const [opcionesB, setOpcionesB] = useState([]);

  useEffect(() => {
    // 🔧 CAMBIAR endpoint y clave del envoltorio (null si es array directo):
    //    Paises: getOpciones("/continentes","continentes") / getOpciones("/idiomas","idiomas")
    //    Recetas: getOpciones("/categorias","categorias") / getOpciones("/areas","areas")
    getOpciones("/categorias", "categorias").then(setOpcionesA).catch(() => {});
    getOpciones("/areas", "areas").then(setOpcionesB).catch(() => {});
  }, []);

  return (
    <div className="filters">
      <select
        className="filter-select"
        value={filtros.categoria}
        onChange={(e) => onChange("categoria", e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {opcionesA.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filtros.area}
        onChange={(e) => onChange("area", e.target.value)}
      >
        <option value="">Todas las áreas</option>
        {opcionesB.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      <input
        type="text"
        className="search-input"
        placeholder="Buscar..."
        value={filtros.buscar}
        onChange={(e) => onChange("buscar", e.target.value)}
      />
    </div>
  );
}

export default Filtros;
