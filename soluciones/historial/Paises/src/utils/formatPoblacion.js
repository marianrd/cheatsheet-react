// Igual que formatPoblacion() del vanilla: 45376763 -> "45.376.763"
export function formatPoblacion(poblacion) {
  if (!poblacion) return "N/A";
  return new Intl.NumberFormat("es-ES").format(poblacion);
}
