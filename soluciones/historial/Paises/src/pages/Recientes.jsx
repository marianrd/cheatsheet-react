import { useState, useEffect } from "react";
import PaisCard from "../components/PaisCard";
import Loading from "../components/Loading";
import { getPais } from "../services/api";
import { usePaisesRecientes } from "../hooks/usePaisesRecientes";

function Recientes() {
  const { recientes, limpiarRecientes } = usePaisesRecientes();
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Equivale a loadPaisesRecientes(): en localStorage solo hay códigos (cca3),
  // así que hay que pedir cada país al API (en paralelo) para mostrar las cards.
  useEffect(() => {
    let cancelled = false;

    if (recientes.length === 0) {
      setPaises([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // allSettled: si un país falla, los demás igual se muestran
    Promise.allSettled(recientes.map((cca3) => getPais(cca3))).then((resultados) => {
      if (cancelled) return;
      setPaises(resultados.filter((r) => r.status === "fulfilled").map((r) => r.value));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [recientes]);

  return (
    <div className="recientes">
      <div className="container">
        <h2 className="page-title">Países Recientes</h2>

        {loading && <Loading />}

        {!loading && paises.length === 0 && (
          <p className="empty-message">No has visto ningún país aún.</p>
        )}

        {!loading && paises.length > 0 && (
          <>
            <div className="paises-grid">
              {paises.map((pais) => (
                <PaisCard key={pais.cca3} pais={pais} />
              ))}
            </div>
            <button className="back-btn" onClick={limpiarRecientes}>
              🗑️ Limpiar recientes
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Recientes;
