#!/bin/bash

# InstallSure Setup Script
# External Review Repository
# Last Updated: 2025-10-06

set -e  # Exit on error

echo "🚀 InstallSure Setup Script"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v20+ first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${CYAN}📋 Node.js Version: $(node --version)${NC}"
echo -e "${CYAN}📋 npm Version: $(npm --version)${NC}"
echo ""

# Navigate to InstallSure directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
INSTALLSURE_DIR="$REPO_ROOT/applications/installsure"

if [ ! -d "$INSTALLSURE_DIR" ]; then
    echo -e "${RED}❌ InstallSure directory not found at: $INSTALLSURE_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found InstallSure directory${NC}"
echo ""

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing InstallSure Frontend dependencies...${NC}"
cd "$INSTALLSURE_DIR/frontend"
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo ""

# Install backend dependencies
echo -e "${YELLOW}📦 Installing InstallSure Backend dependencies...${NC}"
cd "$INSTALLSURE_DIR/backend"
npm install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

# Optional: Create archive if zip is available and user wants it
if command -v zip &> /dev/null; then
    echo -e "${CYAN}📦 Zip utility found${NC}"
    read -p "Would you like to create a zip archive of InstallSure? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$REPO_ROOT"
        ZIP_NAME="InstallSure-$(date +%Y%m%d-%H%M%S).zip"
        echo -e "${YELLOW}📦 Creating archive: $ZIP_NAME${NC}"
        
        # Create zip excluding node_modules and other unnecessary files
        zip -r "$ZIP_NAME" applications/installsure \
            -x "*/node_modules/*" \
            -x "*/.env.local" \
            -x "*/dist/*" \
            -x "*/.git/*" \
            -x "*/coverage/*" \
            -x "*/.DS_Store" \
            -x "*/npm-debug.log" \
            -x "*/yarn-error.log"
        
        echo -e "${GREEN}✅ Archive created: $ZIP_NAME${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Zip utility not found. Skipping archive creation.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 InstallSure setup complete!${NC}"
echo ""
echo -e "${CYAN}📱 To start InstallSure:${NC}"
echo -e "${CYAN}   Frontend: cd applications/installsure/frontend && npm run dev${NC}"
echo -e "${CYAN}   Backend:  cd applications/installsure/backend && npm run dev${NC}"
echo ""
echo -e "${CYAN}🌐 Access the application at: http://localhost:3000${NC}"
echo ""
