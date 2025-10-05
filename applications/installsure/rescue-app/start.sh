#!/bin/bash
# InstallSure Rescue App - Quick Start Script

set -e

echo "═══════════════════════════════════════════════════════"
echo "  InstallSure Rescue - Quick Start"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "Error: Please run this script from the rescue-app directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js v18 or higher from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting InstallSure Rescue App..."
echo ""
echo "Once started, open http://localhost:3000 in your browser"
echo "Press Ctrl+C to stop the server"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Start the server
node server.js
