import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getPais } from "../services/api";
import { usePaisesRecientes } from "../hooks/usePaisesRecientes";
import { formatPoblacion } from "../utils/formatPoblacion";

function PaisDetail() {
  const { cca3 } = useParams();
  const { agregarPaisReciente } = usePaisesRecientes();
  const [pais, setPais] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Equivale a showDetalle(): pedir el país Y agregarlo a recientes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPais(null);

    getPais(cca3)
      .then((data) => {
        if (cancelled) return;
        setPais(data);
        agregarPaisReciente(data.cca3); // <- el historial se alimenta acá
      })
      .catch((err) => {
        if (!cancelled) setError(err.status === 404 ? "País no encontrado." : "Error al cargar el país.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cca3, agregarPaisReciente]);

  // Objeto -> array para poder hacer .map()
  const idiomas = Object.entries(pais?.idiomas || {}); // [["spa","Español"], ...]
  const monedas = Object.entries(pais?.monedas || {}); // [["ARS", {nombre, símbolo}], ...]
  const capital = Array.isArray(pais?.capital) ? pais.capital.join(", ") : pais?.capital || "N/A";

  return (
    <div className="pais-detail">
      <div className="container">
        <Link to="/" className="back-btn">← Volver al catálogo</Link>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {pais && (
          <div className="detalle-container">
            <div className="detalle-header">
              <div className="detalle-image">
                <img src={pais.banderas?.png} alt={pais.nombre?.común} />
              </div>
              <div className="detalle-info">
                <h2>{pais.nombre?.común}</h2>
                <p>{pais.nombre?.oficial}</p>
                <div className="detalle-meta">
                  <span>🌍 <strong>Región:</strong> {pais.región || "N/A"}</span>
                  <span>📍 <strong>Subregión:</strong> {pais.subregión || "N/A"}</span>
                  <span>🏛️ <strong>Capital:</strong> {capital}</span>
                  <span>👥 <strong>Población:</strong> {formatPoblacion(pais.población)}</span>
                </div>
              </div>
            </div>

            {idiomas.length > 0 && (
              <div className="detalle-section">
                <h3>Idiomas</h3>
                <ul className="info-list">
                  {idiomas.map(([codigo, nombre]) => (
                    <li key={codigo}><strong>{codigo.toUpperCase()}:</strong> {nombre}</li>
                  ))}
                </ul>
              </div>
            )}

            {monedas.length > 0 && (
              <div className="detalle-section">
                <h3>Monedas</h3>
                <ul className="info-list">
                  {monedas.map(([codigo, info]) => (
                    <li key={codigo}>
                      <strong>{codigo}:</strong> {info.nombre || codigo}{" "}
                      {info.símbolo ? `(${info.símbolo})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pais.banderas?.alt && (
              <div className="detalle-section">
                <h3>Información de la Bandera</h3>
                <div className="descripcion">{pais.banderas.alt}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaisDetail;
