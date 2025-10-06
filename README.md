# External Review Repository

> Ready-to-run workspace for InstallSure (frontend), Demo Dashboard, and a Node/TypeScript backend.

## Quick Start

```bash
git clone https://github.com/Installsure/External-Review-Repository.git
cd External-Review-Repository

# Preflight: verify Node and free ports
# Windows
powershell -ExecutionPolicy Bypass -File .\tools\preflight-check.ps1
# macOS/Linux
./tools/preflight-check.sh

# Install deps (workspace)
npm install

# Start everything
# Windows
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1
# macOS/Linux
./scripts/start-all.sh
```

### Access Applications

- **InstallSure (frontend)**: http://localhost:3000
- **Demo Dashboard**: http://localhost:3001
- **Backend API (Node/TS)**: http://localhost:8000

## Build System

- **Vite** (frontend)
- **Tailwind CSS**
- **TypeScript** (frontend + backend)

**Note:** Backend is implemented in TypeScript (Node). Any references to FastAPI in older docs were outdated.

## Scripts

```bash
# Run tests for all apps
./scripts/test-all.sh
# or on Windows
powershell -ExecutionPolicy Bypass -File .\scripts\test-all.ps1
```

## Environment

Copy `.env.example` to `.env` at repo root and adjust as needed.

## Contributing

Keep code simple (KISS), typed, and covered by tests.

Lint with `npm run lint`, format with `npm run format`.