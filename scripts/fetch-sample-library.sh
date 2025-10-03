#!/usr/bin/env bash
set -euo pipefail
MANIFEST="${1:-sample-library.manifest.json}"
[ -f "$MANIFEST" ] || { echo "Manifest not found: $MANIFEST"; exit 1; }

DL="samples/library"; PUB="applications/installsure/frontend/public/library"
mkdir -p "$DL" "$PUB"

node -e '
const fs=require("fs");
const m=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
const items=m.items||[];
console.log(JSON.stringify(items));
' "$MANIFEST" | jq -c '.[]' | while read -r item; do
  title=$(echo "$item" | jq -r .title)
  url=$(echo "$item" | jq -r .url)
  dtype=$(echo "$item" | jq -r .docType)
  [ "$url" = "null" ] && continue
  name=$(echo "$title" | tr -cd '[:alnum:]-' | tr '[:upper:]' '[:lower:]')
  ext=".bin"
  # try to infer extension from URL
  case "$url" in
    *.pdf) ext=".pdf" ;;
    *.png) ext=".png" ;;
    *.jpg|*.jpeg) ext=".jpg" ;;
    *.svg) ext=".svg" ;;
  esac
  fn="${name}${ext}"
  curl -fsSL "$url" -o "$DL/$fn" || echo "{\"title\":\"$title\",\"url\":\"$url\",\"error\":\"download failed\"}" >> samples/library-download-report.json
  cp -f "$DL/$fn" "$PUB/$fn" || true
  echo "{\"title\":\"$title\",\"url\":\"$url\",\"saved\":\"$DL/$fn\",\"public\":\"/library/$fn\",\"docType\":\"$dtype\"}" >> samples/library-download-report.json
done
echo "[OK] Downloaded. See samples/library-download-report.json"
