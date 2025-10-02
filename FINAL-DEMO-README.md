# Final App Review — Functional Demo

This repo contains a working Vite+React app, sample docs, and a full CI stack:
- Build CI, E2E tests (Playwright), CodeQL, optional Bandit, Dev Container.
- Minimal MCP JSON for GitHub Copilot Coding Agent.

## Local proof (one command)
```bash
npm i
npx playwright install --with-deps
npm run demo:all
```

This builds the app, starts a preview server, and runs E2E tests automatically.

## Individual Steps
```bash
# Dev mode
npm run dev
# Open http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview

# E2E tests
npm run test:e2e

# E2E tests (UI mode)
npm run test:e2e:ui
```

## GitHub Actions
Push a PR or commit to `main`/`master` to trigger:
- **build.yml** — Builds the Vite app
- **playwright.yml** — Runs E2E tests in CI
- **codeql.yml** — Code scanning for security
- **bandit.yml** — Python SAST (if .py files exist)

## Dev Container
Open in VS Code with Remote-Containers extension for instant setup.

## MCP Configuration
`.github/copilot-mcp.json` provides minimal config for GitHub Copilot Coding Agent with Cloudflare and GitHub MCP servers.

## Structure
- `src/` — React app source
- `docs/` — Sample documentation
- `tests/e2e/` — Playwright tests
- `.github/workflows/` — CI workflows
- `.devcontainer/` — Dev Container config
- `.github/copilot-mcp.json` — MCP config

Ready for external review and CI validation!
