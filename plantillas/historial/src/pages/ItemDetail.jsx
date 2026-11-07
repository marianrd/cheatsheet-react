// ═══════════════════════════════════════════════════════════════════
// pages/ItemDetail.jsx (PLANTILLA HISTORIAL) — detalle + alimenta el historial
// Equivale a showDetalle()/mostrarClima() del vanilla.
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { getItem } from "../services/api.js";
import { useItemsRecientes } from "../hooks/useItemsRecientes.js";

function ItemDetail() {
  // ⚠️ El nombre ("id") tiene que ser el mismo que "/items/:id" en App.jsx
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarItemReciente } = useItemsRecientes();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);   // al cambiar de id hay que volver a "cargando"
    setError(null);
    setItem(null);

    getItem(id)
      .then((data) => {
        if (cancelled) return;
        setItem(data);
        // El historial se alimenta ACÁ, cuando el dato llegó (no antes: si el id no existe no se guarda).
        // 🔧 VERSIÓN A (ids):      agregarItemReciente(data.id)       (data.cca3 · data.idMeal)
        // 🔧 VERSIÓN B (objetos):  agregarItemReciente(data.id, data.nombre)
        agregarItemReciente(data.id);
      })
      .catch((err) => {
        if (!cancelled) setError(err.status === 404 ? "No existe." : "Error al cargar.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id, agregarItemReciente]); // agregarItemReciente es estable (useCallback) -> no hay bucle

  return (
    <div className="detail">
      <div className="container">
        <Link to="/">← Volver</Link>
        {/* o: <button onClick={() => navigate("/")}>← Volver</button>   |   navigate(-1) = página anterior */}

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {item && (
          <div>
            {/* 🔧 CAMBIAR campos (copiá del detalle del vanilla). TILDES: item.año, item.región */}
            <h2>{item.nombre}</h2>
            {item.imagen && <img src={item.imagen} alt={item.nombre} />}
            <p>{item.descripcion}</p>

            {/* SI hay un ARRAY que puede venir vacío (render condicional que piden las rúbricas): */}
            {(item.lista || []).length > 0 && (
              <ul>
                {item.lista.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            )}

            {/* SI hay un OBJETO tipo { spa: "Español" } -> a array con Object.entries:
                {Object.entries(item.idiomas || {}).map(([codigo, nombre]) => <li key={codigo}>{codigo}: {nombre}</li>)} */}

            {/* SI hay CAMPOS NUMERADOS (strIngredient1..20): armá un array con un for:
                const ings = []; for (let i = 1; i <= 20; i++) { const n = item[`strIngredient${i}`]; if (n && n.trim()) ings.push(n); } */}

            {/* SI hay un video de YouTube: convertir watch?v=ID a https://www.youtube.com/embed/ID
                y <iframe src={embed} allowFullScreen />. Solo renderizar si embed existe. */}

            {/* SI piden tabla (Clima):
                <table><tbody>
                  <tr><td>Temperatura</td><td>{item.temperatura} °C</td></tr>
                </tbody></table> */}

            {/* ATAJO si no tenés tiempo: volcar TODOS los campos simples (después afinás):
                {Object.entries(item).filter(([, v]) => typeof v !== "object").map(([k, v]) =>
                  <p key={k}><strong>{k}:</strong> {String(v)}</p>)} */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
