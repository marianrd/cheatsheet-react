import { useState, useEffect } from "react";
import Filtros from "../components/Filtros";
import PaisCard from "../components/PaisCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getPaises } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";

function Home() {
  const [filtros, setFiltros] = useState({ continente: "", idioma: "", buscar: "" });
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // El texto se "retrasa" 500ms: no pedimos al server en cada tecla
  const buscarDebounced = useDebounce(filtros.buscar, 500);

  const handleFilterChange = (nuevosFiltros) => setFiltros(nuevosFiltros);

  // Equivale a loadPaises(): se re-ejecuta cuando cambia algún filtro.
  // Dependencias = valores primitivos (strings), NO el objeto `filtros`.
  useEffect(() => {
    let cancelled = false; // evita que una respuesta vieja pise a una nueva
    setLoading(true);
    setError(null);

    getPaises({
      continente: filtros.continente,
      idioma: filtros.idioma,
      buscar: buscarDebounced,
    })
      .then((data) => {
        if (!cancelled) setPaises(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Error al cargar los países. Asegúrate de que el servidor esté corriendo.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filtros.continente, filtros.idioma, buscarDebounced]);

  return (
    <div className="home">
      <div className="container">
        {/* Filtros SIEMPRE visible (si lo ocultás mientras carga, el input pierde el foco al tipear) */}
        <Filtros filtros={filtros} onFilterChange={handleFilterChange} />

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && paises.length === 0 && (
          <p className="empty-message">No se encontraron países.</p>
        )}

        {!loading && !error && (
          <div className="paises-grid">
            {paises.map((pais) => (
              <PaisCard key={pais.cca3} pais={pais} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
