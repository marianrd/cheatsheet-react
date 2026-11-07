import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import HistorialLista from "../components/HistorialLista";
import { getCiudades } from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [ciudades, setCiudades] = useState([]);
  const [seleccion, setSeleccion] = useState("0"); // POSICIÓN (índice) de la ciudad elegida
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Equivale a cargarCiudades() de index.js (DOMContentLoaded)
  useEffect(() => {
    let cancelled = false;
    getCiudades()
      .then((data) => {
        if (cancelled) return;
        setCiudades(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Equivale a manejarFormulario() de index.js
  const handleSubmit = (event) => {
    event.preventDefault();
    const ciudad = ciudades[Number(seleccion)];
    if (ciudad) navigate(`/clima/${ciudad.id}`); // en vez de window.location.href
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={`No se pudieron cargar las ciudades: ${error}`} />;

  return (
    <div className="home">
      <div className="container">
        <h2 className="page-title">Consulta el Clima</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="ciudades">Seleccione una ciudad:</label>
          {/* Select CONTROLADO: value + onChange */}
          <select
            id="ciudades"
            name="ciudades"
            value={seleccion}
            onChange={(e) => setSeleccion(e.target.value)}
          >
            {ciudades.map((ciudad, index) => (
              // value/key = índice: en datos.json hay ids repetidos (3) y "Lima" dos veces,
              // así que ni id ni nombre sirven como clave única
              <option key={index} value={index}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
          <button type="submit">Consultar Clima</button>
        </form>

        <h2>Historial de Consultas</h2>
        <HistorialLista />
      </div>
    </div>
  );
}

export default Home;
