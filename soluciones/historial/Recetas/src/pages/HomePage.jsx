import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filtros } from "../components/Filtros.jsx";
import { RecetaCard } from "../components/RecetaCard.jsx";
import { Loading } from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { getRecetas } from "../services/api.js";
import { useDebounce } from "../hooks/useDebounce.js";

export function HomePage() {
  // Los filtros viven en la URL: /?categoria=Beef&area=Turkish&buscar=adana
  // => se pueden compartir, y al volver del detalle se conservan.
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get("categoria") ?? "";
  const area = searchParams.get("area") ?? "";
  const buscar = searchParams.get("buscar") ?? "";

  const [texto, setTexto] = useState(buscar); // lo que el usuario ve escrito en el input
  const textoDebounced = useDebounce(texto, 500);

  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cambia (o borra, si está vacío) un parámetro de la URL
  const actualizarParam = (clave, valor) => {
    setSearchParams(
      (prev) => {
        const nuevos = new URLSearchParams(prev);
        if (valor) nuevos.set(clave, valor);
        else nuevos.delete(clave);
        return nuevos;
      },
      { replace: true }, // no llena el historial del navegador con cada filtro
    );
  };

  // El input es instantáneo; la URL (y por ende el fetch) se actualiza con el texto "debounced"
  useEffect(() => {
    actualizarParam("buscar", textoDebounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textoDebounced]);

  const handleChange = (campo, valor) => {
    if (campo === "buscar") setTexto(valor);
    else actualizarParam(campo, valor);
  };

  // Equivale a loadRecetas(): se vuelve a pedir cada vez que cambia la URL
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getRecetas({ categoria, area, buscar })
      .then((data) => {
        if (!cancelled) setRecetas(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Error al cargar las recetas. Asegúrate de que el servidor esté corriendo.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoria, area, buscar]);

  return (
    <>
      <Filtros categoria={categoria} area={area} texto={texto} onChange={handleChange} />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && recetas.length === 0 && (
        <p className="empty-message">No se encontraron recetas.</p>
      )}

      {!loading && !error && (
        <div className="recetas-grid">
          {recetas.map((receta) => (
            <RecetaCard key={receta.idMeal} receta={receta} />
          ))}
        </div>
      )}
    </>
  );
}
