#!/bin/bash

# Cleanup Demo Script
# Stops all running InstallSure processes

echo "🧹 Cleaning up demo environment..."
echo "==================================="

# Kill any running node processes on port 8000
echo "Stopping backend server..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || echo "No processes on port 8000"

# Kill any running node processes on port 3000 (frontend)
echo "Stopping frontend server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No processes on port 3000"

# Kill any running node processes on port 5173 (vite dev server)
echo "Stopping Vite dev server..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No processes on port 5173"

echo ""
echo "✅ Cleanup completed!"
