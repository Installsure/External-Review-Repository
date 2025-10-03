# InstallSure - Construction Management Platform

InstallSure is a construction project management platform with AutoCAD integration.

## Project Structure

```
installsure/
├── backend/          # Express.js backend (Port 8000)
├── frontend/         # React + Vite frontend (Port 3000)
├── package.json      # Root configuration for running both services
└── README.md         # This file
```

## Quick Start

### Prerequisites
- Node.js v20+
- npm v8+

### Installation

Install dependencies for both frontend and backend:

```bash
npm run install:all
```

Or install individually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd frontend && npm install
```

### Development

Start both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:8000
- Frontend dev server on http://localhost:3000

Or run individually:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Production Build

Build both applications:

```bash
npm run build
```

### Testing

Run all tests:

```bash
npm run test
```

## API Endpoints

- Health Check: http://localhost:8000/api/health
- Projects API: http://localhost:8000/api/projects
- Files Upload: http://localhost:8000/api/files/upload
- AutoCAD Integration: http://localhost:8000/api/autocad/*

## Environment Configuration

The backend requires certain environment variables for full functionality:

- `FORGE_CLIENT_ID` - Autodesk Forge Client ID
- `FORGE_CLIENT_SECRET` - Autodesk Forge Client Secret
- `QB_CLIENT_ID` - QuickBooks Client ID
- `QB_CLIENT_SECRET` - QuickBooks Client Secret

See `backend/.env.example` and `frontend/.env.example` for more details.

## Features

- 📊 Project Dashboard
- 📁 File Upload & Management
- 🔧 AutoCAD/Forge Integration
- 📈 Reporting System
- ⚙️ Settings & Configuration

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Redis
- Autodesk Forge API
