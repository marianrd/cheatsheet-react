// Copiado tal cual de getYouTubeEmbedUrl() del vanilla.
// Convierte https://www.youtube.com/watch?v=XXXXXXXXXXX en https://www.youtube.com/embed/XXXXXXXXXXX
// Devuelve null si la URL no es de YouTube válida => NO se renderiza el iframe (es la "validación").
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}
