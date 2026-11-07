import HistorialLista from "../components/HistorialLista";
import { useHistorialConsultas } from "../hooks/useHistorialConsultas";

function Recientes() {
  const { historial, limpiarHistorial } = useHistorialConsultas();

  return (
    <div className="recientes">
      <div className="container">
        <h2 className="page-title">Consultas Recientes</h2>

        <HistorialLista />

        {historial.length > 0 && (
          <div className="action-buttons">
            <button onClick={limpiarHistorial}>🗑️ Limpiar Historial</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recientes;
