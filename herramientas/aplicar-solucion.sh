#!/usr/bin/env bash
# Copia una solución resuelta dentro de react/src de tu examen, instala todo y te dice qué hacer.
#
# USO (parado en la carpeta del examen, la que tiene server/ y react/):
#   bash /ruta/a/cheatsheet-react/herramientas/aplicar-solucion.sh Paises
# o indicando la carpeta del examen:
#   bash /ruta/a/cheatsheet-react/herramientas/aplicar-solucion.sh Paises /ruta/al/examen
#
# Modelos: GameHub TrailerFlix Eventos Clima Paises Recetas

set -e
MODELO="$1"
EXAMEN="${2:-.}"
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOL_ROOT="$AQUI/../soluciones"

case "$MODELO" in
  GameHub|TrailerFlix|Eventos) TIPO=login ;;
  Clima|Paises|Recetas)        TIPO=historial ;;
  *)
    echo "❌ Pasame el nombre del modelo: GameHub | TrailerFlix | Eventos | Clima | Paises | Recetas"
    echo "   Ejemplo: bash $0 Paises"
    exit 1 ;;
esac

SRC="$SOL_ROOT/$TIPO/$MODELO/src"
EXAMEN="$(cd "$EXAMEN" && pwd)"

if [ ! -d "$EXAMEN/react" ] || [ ! -d "$EXAMEN/server" ]; then
  echo "❌ En $EXAMEN no veo las carpetas react/ y server/."
  echo "   Entrá a la carpeta del examen (la que las tiene) o pasala como 2do argumento."
  exit 1
fi

echo "➡️  Modelo: $MODELO  (tipo $TIPO)"
echo "➡️  Examen: $EXAMEN"

# 1) backup del src original, por si lo querés recuperar
if [ -d "$EXAMEN/react/src" ]; then
  BK="$EXAMEN/react/src.original-$(date +%H%M%S)"
  cp -r "$EXAMEN/react/src" "$BK"
  echo "💾 Backup del src original en: $BK  (después borralo antes de entregar)"
fi

# 2) copiar la solución
mkdir -p "$EXAMEN/react/src"
cp -r "$SRC/." "$EXAMEN/react/src/"
echo "✅ Solución copiada a react/src"

# 3) instalar dependencias
if [ -z "$SKIP_INSTALL" ]; then
  echo "📦 Instalando server (puede tardar)..."
  (cd "$EXAMEN/server" && npm install --no-audit --no-fund --silent)
  echo "📦 Instalando react..."
  (cd "$EXAMEN/react" && npm install --no-audit --no-fund --silent)
  echo "✅ Dependencias instaladas"
fi

# 4) puerto de la API (para que sepas dónde mirar)
PUERTO=$(grep -hoE "PORT *(=|\|\|) *[0-9]+|listen\(([0-9]+)" "$EXAMEN"/server/*.js 2>/dev/null | grep -oE "[0-9]{4}" | head -1)
PUERTO="${PUERTO:-3000}"

cat <<EOF

════════════════════════════════════════════════════════
 LISTO. Ahora abrí DOS terminales:

 TERMINAL 1 (la API):
    cd "$EXAMEN/server"
    npm start

 TERMINAL 2 (la app React):
    cd "$EXAMEN/react"
    npm run dev

 Abrí en el navegador:  http://localhost:5173
 (la API vive en http://localhost:$PUERTO — si no carga nada, mirá que la terminal 1 siga prendida)
════════════════════════════════════════════════════════
EOF
