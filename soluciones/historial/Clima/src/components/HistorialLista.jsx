import { Link } from "react-router-dom";
import { useHistorialConsultas } from "../hooks/useHistorialConsultas";

// Lista de consultas con links. Se reutiliza en Home, ClimaDetail y Recientes
// (en el vanilla se repetía el mismo código en index.js y clima.js).
function HistorialLista() {
  const { historial } = useHistorialConsultas();

  if (historial.length === 0) {
    return <p className="empty-message">Todavía no consultaste ninguna ciudad.</p>;
  }

  return (
    <ul id="listaHistorial">
      {historial.map((consulta) => (
        <li key={consulta.id}>
          <Link to={`/clima/${consulta.id}`}>
            📍 {consulta.ciudad} - 🕒 {consulta.fecha}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default HistorialLista;
