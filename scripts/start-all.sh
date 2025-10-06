#!/usr/bin/env bash
set -euo pipefail
echo "Starting services..."

if command -v docker >/dev/null 2>&1; then
  docker compose -f docker-compose.yml up -d redis
fi

( cd applications/installsure/backend && npm run dev ) &
( cd applications/installsure/frontend && npm run dev ) &
( cd applications/demo-dashboard/frontend && npm run dev ) &

wait
