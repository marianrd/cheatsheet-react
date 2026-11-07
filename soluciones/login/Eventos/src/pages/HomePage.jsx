import { useEventos } from "../hooks/useEventos.js";
import { EventoCard } from "../components/EventoCard.jsx";

export function HomePage() {
  const { eventos, loading, error } = useEventos();

  if (loading) {
    return (
      <section className="status">
        <h2>⏳ Cargando cartelera de shows...</h2>
      </section>
    );
  }
  if (error) {
    return (
      <section className="status">
        <h2>Servidor Inaccesible</h2>
        <p>Estamos experimentando problemas para desplegar la cartelera.</p>
        <p>{error.message}</p>
      </section>
    );
  }

  // Si el enunciado pide ordenar por fecha, descomentá esto y usá `ordenados` en el map:
  // const ordenados = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <section>
      <h1>Descubre tu próximo Concierto</h1>
      <p>La cartelera musical más extensa del año a un solo clic.</p>

      {eventos.length === 0 ? (
        <p className="status">No hay eventos disponibles.</p>
      ) : (
        <div className="games-grid">
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}
    </section>
  );
}
