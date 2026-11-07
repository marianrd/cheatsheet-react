import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import HistorialLista from "../components/HistorialLista";
import { getCiudad } from "../services/api";
import { useHistorialConsultas } from "../hooks/useHistorialConsultas";

function ClimaDetail() {
  const { id } = useParams(); // <- reemplaza a obtenerParametroURL("id")
  const navigate = useNavigate();
  const { agregarConsulta, limpiarHistorial } = useHistorialConsultas();

  const [ciudad, setCiudad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Equivale a mostrarClima() de clima.js
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCiudad(null);

    getCiudad(id)
      .then((data) => {
        if (cancelled) return;
        setCiudad(data);
        agregarConsulta(data.id, data.nombre); // = guardarEnHistorial()
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.status === 404 ? "La ciudad no existe." : err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, agregarConsulta]); // agregarConsulta es estable (useCallback) => no hay loop

  return (
    <div className="clima-detail">
      <div className="container">
        <h2 className="page-title">Clima de la ciudad</h2>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {ciudad && (
          <table id="tablaClima">
            <tbody>
              <tr><td>🏙️ Ciudad</td><td>{ciudad.nombre}</td></tr>
              <tr><td>🌡️ Temperatura</td><td>{ciudad.temperatura} °C</td></tr>
              <tr><td>💧 Humedad</td><td>{ciudad.humedad} %</td></tr>
              <tr><td>☁️ Condición</td><td>{ciudad.condicion}</td></tr>
            </tbody>
          </table>
        )}

        <h2>Historial de consultas</h2>
        <HistorialLista />

        <div className="action-buttons">
          <button onClick={() => navigate("/")}>← Volver a la Página Anterior</button>
          <button onClick={limpiarHistorial}>🗑️ Limpiar Historial</button>
        </div>
      </div>
    </div>
  );
}

export default ClimaDetail;
