#!/usr/bin/env bash
# Prueba endpoints de la API y muestra status + forma de la respuesta (sin ver todo el JSON).
#
# Uso:
#   ./check-api.sh http://localhost:3000/api/paises
#   ./check-api.sh http://localhost:3000/api/paises http://localhost:3000/api/paises/ARG
#   ./check-api.sh -p http://localhost:3000/api/login '{"username":"alexg","password":"alexgpass"}'   # POST
#
# Sin argumentos: busca qué puerto de API está vivo (3000/3001/3002).

post=false
if [ "$1" = "-p" ]; then post=true; shift; fi

if [ $# -eq 0 ]; then
  for p in 3000 3001 3002 8080; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$p/api" )
    [ "$code" != "000" ] && echo "puerto $p responde (HTTP $code al GET /api)"
  done
  echo "Pasá una URL completa para probar un endpoint."
  exit 0
fi

# Muestra: status, y claves/tipos del JSON (primer nivel y primer elemento de arrays)
forma='
import sys, json
try:
    d = json.load(sys.stdin)
except Exception as e:
    print("   (no es JSON)", e); sys.exit()
def desc(x, prof=0):
    pad = "   " * (prof + 1)
    if isinstance(x, dict):
        for k, v in list(x.items())[:15]:
            t = type(v).__name__
            extra = f"[{len(v)}]" if isinstance(v, (list, dict)) else repr(v)[:50]
            print(f"{pad}{k}: {t} {extra}")
            if prof < 1 and isinstance(v, list) and v and isinstance(v[0], dict):
                print(f"{pad}  └─ primer elemento: {list(v[0].keys())[:12]}")
    elif isinstance(x, list):
        print(f"{pad}ARRAY de {len(x)} elementos")
        if x and isinstance(x[0], dict):
            print(f"{pad}  └─ primer elemento: {list(x[0].keys())[:12]}")
    else:
        print(pad + repr(x)[:100])
desc(d)
'

if $post; then
  url=$1; body=$2
  echo "POST $url  $body"
  resp=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$body" "$url")
else
  resp=""
fi

for url in "$@"; do
  $post && break
  echo "GET $url"
  resp=$(curl -s -w "\n%{http_code}" --max-time 5 "$url")
  status=${resp##*$'\n'}; body=${resp%$'\n'*}
  echo "   HTTP $status"
  echo "$body" | python3 -c "$forma"
done

if $post; then
  status=${resp##*$'\n'}; body=${resp%$'\n'*}
  echo "   HTTP $status"
  echo "$body" | python3 -c "$forma"
fi
