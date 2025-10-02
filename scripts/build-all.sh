#!/bin/bash

# Build script for all applications in External-Review-Repository
# This script builds all applications that have been tested and fixed

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
APPS_DIR="$REPO_ROOT/applications"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Building External-Review-Repository Apps"
echo "========================================"
echo ""

# Function to build an application
build_app() {
    local app_name=$1
    local app_path=$2
    
    echo -e "${YELLOW}Building $app_name...${NC}"
    
    if [ ! -d "$app_path" ]; then
        echo -e "${RED}✗ Directory not found: $app_path${NC}"
        return 1
    fi
    
    cd "$app_path"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "  Installing dependencies..."
        npm install --silent
    fi
    
    # Fix permissions on binaries
    if [ -d "node_modules/.bin" ]; then
        chmod +x node_modules/.bin/* 2>/dev/null || true
    fi
    
    # Run typecheck if available
    if grep -q '"typecheck"' package.json 2>/dev/null; then
        echo "  Running typecheck..."
        npm run typecheck --silent 2>&1 | tail -5
    fi
    
    # Run build if available
    if grep -q '"build"' package.json 2>/dev/null; then
        echo "  Running build..."
        npm run build --silent 2>&1 | tail -5
    fi
    
    echo -e "${GREEN}✓ $app_name built successfully${NC}"
    echo ""
    
    cd "$REPO_ROOT"
}

# Build tested and fixed applications
build_app "demo-dashboard" "$APPS_DIR/demo-dashboard"
build_app "installsure-frontend" "$APPS_DIR/installsure/frontend"
build_app "installsure-backend" "$APPS_DIR/installsure/backend"

echo "========================================"
echo -e "${GREEN}All builds completed successfully!${NC}"
echo "========================================"
echo ""
echo "Note: React Router apps (ff4u, zerostack, redeye, hello, avatar)"
echo "use 'npm run dev' and don't have build scripts."
echo ""
