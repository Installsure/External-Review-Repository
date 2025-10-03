# Quick Start Guide

## InstallSure A→Z Demo

### Prerequisites
- Node.js 20+
- npm

### Setup & Run

#### 1. Install Dependencies

```bash
# Frontend
cd applications/installsure/frontend
npm install

# Backend
cd ../backend
npm install
```

#### 2. Start Servers

**Terminal 1 - Backend:**
```bash
cd applications/installsure/backend
npm run dev
```
Backend will start on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd applications/installsure/frontend
npm run dev
```
Frontend will start on http://localhost:3000

#### 3. Access Demo

Navigate to: **http://localhost:3000/demo**

### Demo Workflow

1. **Upload Plan**
   - Click file input and select a PDF or image
   - Click "Open Plan" button

2. **Add Pins**
   - Click anywhere on the plan
   - Pin appears as red circle
   - Selected pin turns blue

3. **Add Details to Pin**
   - With pin selected, right panel shows details
   - Upload photo (optional)
   - Add note in textarea
   - Set status

4. **Switch to 3D View**
   - Click "3D Viewer" in left nav
   - See IFC viewer placeholder

5. **Run QTO Calculation**
   - In 3D view, select assembly type:
     - Paint Wall: requires length, height
     - Concrete Slab: requires length, width, thickness
   - Enter dimensions
   - Click "Run QTO"
   - View quantity and cost results

6. **Persistence**
   - All data saves to localStorage automatically
   - Refresh page to see data restored

### API Testing

Test the QTO endpoint directly:

```bash
# Paint Wall
curl -X POST http://localhost:8000/api/qto-demo \
  -H "Content-Type: application/json" \
  -d '{
    "assembly": "paint_wall",
    "inputs": {
      "length": 12,
      "height": 3,
      "unitCost": 2.5
    }
  }'

# Expected: {"success":true,"data":{"quantity":36,"unit":"m2","cost":90}}

# Concrete Slab
curl -X POST http://localhost:8000/api/qto-demo \
  -H "Content-Type: application/json" \
  -d '{
    "assembly": "concrete_slab",
    "inputs": {
      "length": 5,
      "width": 5,
      "thickness": 0.1,
      "unitCost": 120
    }
  }'

# Expected: {"success":true,"data":{"quantity":2.5,"unit":"m3","cost":300}}
```

### Troubleshooting

**"Permission denied" errors:**
```bash
# Fix executable permissions
cd applications/installsure/backend
chmod +x node_modules/.bin/*

cd ../frontend
chmod +x node_modules/.bin/*
```

**Port conflicts:**
- Backend uses port 8000
- Frontend uses port 3000
- Check no other services are using these ports

**Build errors:**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## NexusLocalAI

### Prerequisites
- Python 3.8+
- pip
- Ollama (optional)
- Docker (optional, for Qdrant)

### Quick Start (Windows)

```powershell
cd nexus-local-ai
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap.ps1
```

This will:
1. Install Python dependencies
2. Check for Ollama
3. Pull AI models (if Ollama installed)
4. Start router on :8099
5. Start memory service
6. Start avatar bridge on :8765
7. Start Qdrant (if Docker available)

### Quick Start (Linux/Mac)

```bash
cd nexus-local-ai

# Install dependencies
pip install flask requests pyyaml websockets

# Start services
python router/main.py &
python memory/snapshot.py &
python avatar/bridge.py &

# Optional: Start Qdrant
docker-compose up -d
```

### Verify NexusLocalAI

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-tests.ps1
```

Or manually:
```bash
# Router health
curl http://localhost:8099/health

# Test routing
curl -X POST http://localhost:8099/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a Python function"}'
```

### NexusLocalAI Services

Once running:
- **Router**: http://localhost:8099
  - Health: http://localhost:8099/health
  - Route: http://localhost:8099/route
  - OpenAI API: http://localhost:8099/v1/chat/completions
- **Avatar Bridge**: ws://localhost:8765
- **Memory Snapshots**: `./nexus-local-ai/memory/snapshots/`
- **Qdrant** (optional): http://localhost:6333

### Configuration

Edit `.env` in `nexus-local-ai/`:
```env
DEFAULT_MODEL=qwen2.5-coder:7b
ROUTER_PORT=8099
AVATAR_PORT=8765
MEMORY_SNAPSHOT_INTERVAL=60
```

Edit `guardrails/config.yaml` for content filters and routing rules.

---

## Running Playwright Tests

### Install Playwright Browsers

```bash
npx playwright install chromium
```

### Run Tests

```bash
# All tests
npx playwright test

# With UI
npx playwright test --ui

# Specific test
npx playwright test tests/e2e/installsure.spec.ts

# Debug mode
npx playwright test --debug
```

### Prerequisites for Tests
- Frontend must be running on :3000
- Backend must be running on :8000
- Test assets must be in `tests/assets/`

### Test Coverage

The Playwright test (`tests/e2e/installsure.spec.ts`) covers:
1. ✅ Navigate to demo page
2. ✅ Upload plan PDF
3. ✅ Open plan viewer
4. ✅ Drop pin on plan
5. ✅ Attach photo to pin
6. ✅ Add note to pin
7. ✅ Switch to 3D view
8. ✅ Select assembly type
9. ✅ Input QTO parameters
10. ✅ Run QTO calculation
11. ✅ Verify cost appears in output

---

## Production Deployment

### Build Frontend

```bash
cd applications/installsure/frontend
npm run build
```

Output in `dist/` directory.

### Build Backend

```bash
cd applications/installsure/backend
npm run build
```

Output in `dist/` directory.

### Environment Variables

**Backend** (`.env`):
```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://...
FORGE_CLIENT_ID=...
FORGE_CLIENT_SECRET=...
```

**Frontend** (`.env.production`):
```env
VITE_API_BASE=https://api.installsure.com
```

### Docker (Future)

Docker configurations exist but need updates for demo page:
- `applications/installsure/frontend/Dockerfile`
- `applications/installsure/backend/Dockerfile`

---

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite HMR automatically refreshes
- Backend: tsx watch restarts on file changes

### Debugging
- Frontend: Use browser DevTools, React DevTools
- Backend: Add `debugger` statements, use Node inspector
- Playwright: Run with `--debug` flag

### Code Style
```bash
# Frontend
npm run lint
npm run format

# Backend
npm run lint
npm run typecheck
```

### Clear LocalStorage
```javascript
// In browser console
localStorage.clear()
```

---

## Support

For issues or questions:
1. Check `IMPLEMENTATION_SUMMARY.md` for details
2. Review `UI_LAYOUT_GUIDE.md` for UI structure
3. Check server logs for errors
4. Verify all dependencies are installed
