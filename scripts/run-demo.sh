#!/bin/bash
# Interactive E2E Demo Runner
# Guides users through the complete demo experience
# External Review Repository

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║           🎬 E2E DEMO INTERACTIVE RUNNER 🎬                ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║         External Review Repository Demo Suite             ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Function to print section header
print_section() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to wait for user
wait_for_user() {
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
}

# Function to open URL
open_url() {
    local url=$1
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url" &> /dev/null
    elif command -v open &> /dev/null; then
        open "$url" &> /dev/null
    else
        echo -e "${YELLOW}Please open this URL manually: $url${NC}"
    fi
}

# Introduction
print_section "WELCOME TO THE E2E DEMO"

echo -e "${GREEN}This interactive demo will guide you through:${NC}"
echo "  1. ✅ Verifying all applications are ready"
echo "  2. 🚀 Starting the demo dashboard"
echo "  3. 🎯 Walking through key features"
echo "  4. 📊 Demonstrating each application"
echo ""
echo -e "${BLUE}Demo Duration: ${NC}~30 minutes (or skip ahead anytime)"
echo -e "${BLUE}Prerequisites: ${NC}Node.js v20+, npm v8+"

wait_for_user

# Step 1: Check Prerequisites
print_section "STEP 1: CHECKING PREREQUISITES"

echo -e "${BLUE}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js v20+${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found. Please install npm v8+${NC}"
    exit 1
fi

wait_for_user

# Step 2: Install Dependencies
print_section "STEP 2: INSTALLING DEPENDENCIES"

echo -e "${BLUE}Checking if demo dashboard dependencies are installed...${NC}"

cd "$REPO_ROOT/applications/demo-dashboard"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies for demo dashboard...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed!${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

wait_for_user

# Step 3: Start Demo Dashboard
print_section "STEP 3: STARTING DEMO DASHBOARD"

echo -e "${BLUE}Starting the demo dashboard on port 3001...${NC}"
echo ""
echo -e "${YELLOW}Note: This will run in the background${NC}"
echo ""

# Check if already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Demo dashboard is already running!${NC}"
else
    nohup npm run dev > /tmp/demo-dashboard.log 2>&1 &
    DASHBOARD_PID=$!
    echo $DASHBOARD_PID > /tmp/demo-dashboard.pid
    
    echo -e "${BLUE}Waiting for dashboard to start...${NC}"
    sleep 10
    
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Demo dashboard started successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to start demo dashboard${NC}"
        echo -e "${YELLOW}Check logs: /tmp/demo-dashboard.log${NC}"
        exit 1
    fi
fi

wait_for_user

# Step 4: Open Dashboard in Browser
print_section "STEP 4: OPENING DEMO DASHBOARD"

echo -e "${BLUE}Opening demo dashboard in your browser...${NC}"
echo ""
echo -e "${GREEN}URL: ${NC}http://localhost:3001"
echo ""

open_url "http://localhost:3001"

echo -e "${CYAN}The Demo Dashboard provides:${NC}"
echo "  • Visual overview of all 7 applications"
echo "  • Quick access to each application"
echo "  • Feature comparison and details"
echo "  • Technology stack information"

wait_for_user

# Step 5: Demo Walkthrough
print_section "STEP 5: DEMO WALKTHROUGH"

echo -e "${MAGENTA}═══ DEMO DASHBOARD TOUR ═══${NC}"
echo ""
echo -e "${BLUE}What you should see:${NC}"
echo "  1. 🎯 A clean, modern interface"
echo "  2. 📱 Six application cards displayed"
echo "  3. 🔵 'Launch Demo' buttons for each app"
echo ""
echo -e "${YELLOW}Available Applications:${NC}"
echo "  • InstallSure (Port 3000) - Construction Management"
echo "  • FF4U (Port 3002) - Fitness Platform"
echo "  • RedEye (Port 3003) - Project Management"
echo "  • ZeroStack (Port 3004) - Infrastructure Management"
echo "  • Hello (Port 3005) - Digital Business Cards"
echo "  • Avatar (Port 3006) - AI Avatar Platform"

wait_for_user

# Step 6: Individual App Demo (Optional)
print_section "STEP 6: LAUNCHING INDIVIDUAL APPS (OPTIONAL)"

echo -e "${BLUE}Would you like to start additional applications for testing?${NC}"
echo ""
echo -e "${YELLOW}Note: Each application requires its own dependencies to be installed${NC}"
echo ""
echo "Choose an option:"
echo "  1) Skip - Continue with dashboard only"
echo "  2) Start all applications"
echo "  3) Start specific application"
echo ""
read -p "Your choice (1-3): " choice

case $choice in
    2)
        echo ""
        echo -e "${BLUE}Starting all applications...${NC}"
        cd "$REPO_ROOT"
        ./scripts/start-all.sh
        ;;
    3)
        echo ""
        echo "Which application would you like to start?"
        echo "  1) InstallSure"
        echo "  2) FF4U"
        echo "  3) RedEye"
        echo "  4) ZeroStack"
        echo "  5) Hello"
        echo "  6) Avatar"
        read -p "Your choice (1-6): " app_choice
        
        case $app_choice in
            1) APP_NAME="installsure"; PORT=3000 ;;
            2) APP_NAME="ff4u"; PORT=3002 ;;
            3) APP_NAME="redeye"; PORT=3003 ;;
            4) APP_NAME="zerostack"; PORT=3004 ;;
            5) APP_NAME="hello"; PORT=3005 ;;
            6) APP_NAME="avatar"; PORT=3006 ;;
            *) echo "Invalid choice"; APP_NAME="" ;;
        esac
        
        if [ ! -z "$APP_NAME" ]; then
            cd "$REPO_ROOT/applications/$APP_NAME"
            if [ ! -d "node_modules" ]; then
                echo -e "${YELLOW}Installing dependencies...${NC}"
                npm install
            fi
            echo -e "${BLUE}Starting $APP_NAME on port $PORT...${NC}"
            nohup npm run dev > "/tmp/$APP_NAME.log" 2>&1 &
            echo $! > "/tmp/$APP_NAME.pid"
            sleep 5
            echo -e "${GREEN}✅ $APP_NAME started!${NC}"
            echo -e "${GREEN}Access at: ${NC}http://localhost:$PORT"
            open_url "http://localhost:$PORT"
        fi
        ;;
    *)
        echo -e "${BLUE}Continuing with dashboard only${NC}"
        ;;
esac

wait_for_user

# Step 7: Demo Credentials
print_section "STEP 7: DEMO CREDENTIALS"

echo -e "${CYAN}Use these credentials when logging into applications:${NC}"
echo ""
echo -e "${GREEN}┌─────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│  Email:    demo@[app-name].com              │${NC}"
echo -e "${GREEN}│  Password: demo123                          │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${YELLOW}Examples:${NC}"
echo "  • demo@installsure.com / demo123"
echo "  • admin@ff4u.com / demo123"
echo "  • demo@redeye.com / demo123"

wait_for_user

# Step 8: Additional Resources
print_section "STEP 8: ADDITIONAL RESOURCES"

echo -e "${CYAN}📚 Documentation:${NC}"
echo "  • E2E Demo Guide: documentation/E2E_DEMO_GUIDE.md"
echo "  • Quick Start: QUICK_START_DEMO.md"
echo "  • Setup Guide: documentation/SETUP_GUIDE.md"
echo ""
echo -e "${CYAN}🔧 Useful Commands:${NC}"
echo "  • Verify apps: ./scripts/verify-demo.sh"
echo "  • Stop all: ./scripts/stop-all.sh"
echo "  • Start all: ./scripts/start-all.sh"

wait_for_user

# Final Summary
print_section "DEMO SUMMARY"

echo -e "${GREEN}✅ Demo is now running!${NC}"
echo ""
echo -e "${CYAN}Active Services:${NC}"
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Demo Dashboard${NC} - http://localhost:3001"
else
    echo -e "${RED}  ❌ Demo Dashboard${NC}"
fi

for port in 3000 3002 3003 3004 3005 3006; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        case $port in
            3000) APP="InstallSure" ;;
            3002) APP="FF4U" ;;
            3003) APP="RedEye" ;;
            3004) APP="ZeroStack" ;;
            3005) APP="Hello" ;;
            3006) APP="Avatar" ;;
        esac
        echo -e "${GREEN}  ✅ $APP${NC} - http://localhost:$port"
    fi
done

echo ""
echo -e "${YELLOW}To stop the demo, run:${NC} ./scripts/stop-all.sh"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}        🎉 Enjoy your demo! 🎉${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
