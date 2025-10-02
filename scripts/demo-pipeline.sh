#!/bin/bash

# Demo Pipeline Script
# Starts the InstallSure backend and runs the demo

set -e

echo "🚀 Starting InstallSure Demo Pipeline..."
echo "========================================="

# Navigate to backend directory
cd "$(dirname "$0")/../applications/installsure/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the backend
echo "🔨 Building backend..."
npm run build

# Start the server in the background
echo "🚀 Starting backend server on port 8000..."
npm run dev &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 5

# Test if server is running
if curl -s http://localhost:8000/api/health > /dev/null; then
  echo "✅ Server is ready!"
else
  echo "❌ Server failed to start"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

# Run the API smoke tests
echo ""
echo "🧪 Running API smoke tests..."
cd ../../..
./scripts/test-api.sh

echo ""
echo "========================================="
echo "✅ Demo pipeline completed successfully!"
echo ""
echo "Server is running on http://localhost:8000"
echo "API Health: http://localhost:8000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo "Or run: ./scripts/cleanup-demo.sh"
echo ""

# Keep the server running
wait $SERVER_PID
