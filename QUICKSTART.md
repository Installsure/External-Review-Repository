# InstallSure Quick Start Guide

This guide will get you up and running with InstallSure in under 5 minutes.

## Prerequisites

- **Node.js** v20+ ([Download](https://nodejs.org/))
- **npm** v8+
- **Git**
- **curl** (for testing)

## 🚀 Option 1: Automated Smoke Test (Recommended)

The fastest way to test the complete system:

### Windows (PowerShell)

```powershell
# Clone the repository
git clone <repository-url>
cd External-Review-Repository

# Run the smoke test
powershell -ExecutionPolicy Bypass -File scripts\smoke.ps1
```

### macOS/Linux/WSL

```bash
# Clone the repository
git clone <repository-url>
cd External-Review-Repository

# Run the smoke test
bash scripts/smoke.sh
```

The smoke script will:
1. Install all dependencies
2. Start backend and frontend
3. Run tests
4. Display results

**Expected Output:**
```
================================================================
  InstallSure Smoke Test Suite
================================================================

▶ Installing backend dependencies...
✓ Backend dependencies ready
▶ Installing frontend dependencies...
✓ Frontend dependencies ready
▶ Starting backend on port 8099...
✓ Backend started
▶ Starting frontend on port 3000...
✓ Frontend started
▶ Waiting for services to be ready...
✓ All services are ready
▶ Installing Playwright browsers...
✓ Playwright browsers installed
▶ Running Playwright E2E tests...
✓ Playwright tests passed
▶ Running backend unit tests...
✓ Backend tests passed

================================================================
  Test Summary
================================================================
  Passed: 8
  Failed: 0

  ✓ ALL TESTS PASSED
```

## 🚀 Option 2: Manual Setup

If you prefer to start services manually:

### Step 1: Install Dependencies

```bash
# Backend
cd applications/installsure/backend
npm install

# Frontend (in a new terminal)
cd applications/installsure/frontend
npm install

# Tests (in a new terminal)
cd tests
npm install
```

### Step 2: Start Backend

```bash
cd applications/installsure/backend
npm run dev
```

Expected output:
```
🚀 InstallSure Backend running on port 8099
📊 Health check: http://localhost:8099/api/health
🔧 Environment: development
```

### Step 3: Start Frontend

```bash
cd applications/installsure/frontend
npm run dev
```

Expected output:
```
  VITE v5.4.20  ready in 123 ms

  ➜  Local:   http://127.0.0.1:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 4: Verify Installation

**Test Backend Health:**
```bash
curl http://127.0.0.1:8099/api/health
```

Expected response:
```json
{
  "ok": true,
  "uptime": 123.456,
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "database": "connected",
    "redis": "connected",
    "forge": "not_configured"
  }
}
```

**Test Projects API:**
```bash
curl http://127.0.0.1:8099/api/projects
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Downtown Office Building",
      "description": "Modern 20-story office complex with sustainable design",
      "status": "active",
      ...
    }
  ],
  "count": 2
}
```

**Open Frontend:**
Open http://127.0.0.1:3000 in your browser. You should see the InstallSure dashboard.

## 🧪 Testing

### Run Playwright E2E Tests

```bash
cd tests
npm test
```

### Run Backend Unit Tests

```bash
cd applications/installsure/backend
npm test
```

### Run API Validation Script

```bash
# Make sure backend is running first
bash scripts/validate-api.sh
```

Expected output:
```
============================================
  InstallSure System Validation
============================================

▶ Checking backend health...
✓ Backend is healthy
▶ Testing projects API...
✓ Projects API working
▶ Testing tag creation...
✓ Tag creation working
▶ Testing RFI creation...
✓ RFI creation working
▶ Testing RFI listing...
✓ RFI listing working

============================================
  ✓ All API tests passed!
============================================
```

## 🔌 API Endpoints

All endpoints are available at `http://127.0.0.1:8099/api`

### Health & Status
- `GET /api/health` - Service health check

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Plans
- `GET /api/plans` - List all plans
- `POST /api/plans/upload` - Upload a plan file (PDF/PNG)

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create a tag
  ```json
  {
    "plan_id": "1",
    "x": 0.5,
    "y": 0.5,
    "type": "RFI",
    "label": "Tag 001"
  }
  ```

### RFIs (Requests for Information)
- `GET /api/rfis` - List all RFIs
- `POST /api/rfis` - Create an RFI
  ```json
  {
    "title": "RFI-001: Clarification Needed",
    "description": "Need details on beam specification",
    "project_id": "1",
    "tag_id": "tag-1"
  }
  ```
- `GET /api/rfis/:id` - Get RFI details
- `PUT /api/rfis/:id` - Update RFI

### Change Orders
- `GET /api/change-orders` - List all change orders
- `POST /api/change-orders` - Create a change order

### Liens
- `GET /api/liens` - List all liens
- `POST /api/liens` - Create a lien

### Photos
- `GET /api/photos` - List all photos
- `POST /api/photos/upload` - Upload a photo

### Time Tracking
- `GET /api/time` - List time entries
- `POST /api/time` - Create time entry

### Debug
- `POST /api/debug/seed` - Load seed data from JSON

## 📝 Example Workflow

### 1. Create a Project

```bash
curl -X POST http://127.0.0.1:8099/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Construction Project",
    "description": "5-story commercial building"
  }'
```

### 2. Create a Tag

```bash
curl -X POST http://127.0.0.1:8099/api/tags \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "plan-1",
    "x": 0.35,
    "y": 0.45,
    "type": "RFI",
    "label": "Need clarification"
  }'
```

### 3. Create an RFI from the Tag

```bash
curl -X POST http://127.0.0.1:8099/api/rfis \
  -H "Content-Type: application/json" \
  -d '{
    "title": "RFI-001: Foundation Detail",
    "description": "Need specs for foundation depth",
    "project_id": "1",
    "tag_id": "tag-1"
  }'
```

### 4. List RFIs

```bash
curl http://127.0.0.1:8099/api/rfis
```

## 🐛 Troubleshooting

See the [Troubleshooting Section](README.md#-troubleshooting) in the main README for common issues and solutions.

## 📚 Additional Resources

- [Full README](README.md) - Complete documentation
- [Acceptance Criteria](ACCEPTANCE_CRITERIA.md) - Validation report
- [Setup Guide](documentation/SETUP_GUIDE.md) - Detailed setup
- [API Documentation](documentation/API_DOCUMENTATION.md) - API reference

## 🎯 Next Steps

1. ✅ Start the application using the smoke script
2. ✅ Verify all endpoints work
3. ✅ Explore the frontend at http://127.0.0.1:3000
4. ✅ Run tests to ensure everything works
5. 🚀 Start building your construction management workflows!

---

**Need Help?** Check the troubleshooting section or review the test logs for detailed error messages.
