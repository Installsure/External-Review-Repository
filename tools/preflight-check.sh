#!/usr/bin/env bash
set -euo pipefail
need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing $1"; exit 1; }; }
need node
NEED_VER=20
NODE_MAJ=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJ" -lt "$NEED_VER" ]; then
  echo "Node >=20 required"; exit 1
fi
for p in 3000 3001 8000; do
  if lsof -i :"$p" -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port $p in use"; exit 1
  fi
done
echo "Preflight OK."
