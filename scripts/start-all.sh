#!/bin/bash
# Start All Applications Script - Cross-Platform
# External Review Repository
# Last Updated: 2025-10-06
# Production Hardening - Phase 1

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting All Applications (Production Mode)...${NC}"
echo -e "${CYAN}=================================${NC}"

# Run preflight checks first
echo -e "${YELLOW}🔍 Running preflight checks...${NC}"
if ./tools/preflight-check.sh; then
    echo -e "   ${GREEN}✅ Preflight checks passed${NC}"
else
    echo -e "   ${RED}❌ Preflight checks failed. Please address issues before starting.${NC}"
    exit 1
fi

# Check and start Redis if available
if command -v docker &> /dev/null; then
    echo -e "\n${YELLOW}🔄 Starting Redis (Docker)...${NC}"
    if docker ps -a --filter "name=redis-installsure" --format "{{.Names}}" | grep -q "redis-installsure"; then
        docker start redis-installsure > /dev/null 2>&1 || true
        echo -e "   ${GREEN}✅ Redis container restarted${NC}"
    else
        docker run -d --name redis-installsure -p 6379:6379 redis:7-alpine > /dev/null 2>&1 || true
        echo -e "   ${GREEN}✅ Redis started on port 6379${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  Docker not found - Redis will not be available${NC}"
fi

# Enhanced function to start applications with error handling
start_app() {
    local app_name="$1"
    local app_path="$2"
    local port="$3"
    local description="$4"
    local critical="${5:-false}"
    
    echo -e "\n${YELLOW}🔄 Starting $app_name...${NC}"
    echo -e "   ${GRAY}Port: $port${NC}"
    echo -e "   ${GRAY}Description: $description${NC}"
    
    # Check if directory exists
    if [ ! -d "$app_path" ]; then
        echo -e "   ${RED}❌ Application directory not found: $app_path${NC}"
        if [ "$critical" = "true" ]; then
            exit 1
        fi
        return
    fi
    
    # Check if port is already in use (cross-platform check)
    if command -v lsof &> /dev/null; then
        if lsof -i :$port &> /dev/null; then
            echo -e "   ${YELLOW}⚠️  Port $port is already in use. Skipping $app_name.${NC}"
            return
        fi
    elif command -v netstat &> /dev/null; then
        if netstat -tuln | grep ":$port " &> /dev/null; then
            echo -e "   ${YELLOW}⚠️  Port $port is already in use. Skipping $app_name.${NC}"
            return
        fi
    fi
    
    # Check if package.json exists
    if [ ! -f "$app_path/package.json" ]; then
        echo -e "   ${RED}❌ package.json not found in $app_path${NC}"
        if [ "$critical" = "true" ]; then
            exit 1
        fi
        return
    fi
    
    # Start the application with enhanced error handling
    local start_location=$(pwd)
    cd "$app_path"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "   ${BLUE}📦 Installing dependencies...${NC}"
        npm install --silent
    fi
    
    # Start in background with proper terminal handling
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$app_name" -- bash -c "echo 'Starting $app_name on port $port...'; npm run dev; read -p 'Press Enter to close...'"
    elif command -v xterm &> /dev/null; then
        xterm -title "$app_name" -e "bash -c 'echo Starting $app_name on port $port...; npm run dev; read -p \"Press Enter to close...\"'" &
    else
        # Fallback for systems without GUI terminals
        nohup npm run dev > "$app_name.log" 2>&1 &
        echo "   ${BLUE}📝 Log file: $app_name.log${NC}"
    fi
    
    cd "$start_location"
    echo -e "   ${GREEN}✅ $app_name started successfully${NC}"
    sleep 2  # Give process time to start
}

# Start core applications (Critical Path)
echo -e "\n${CYAN}🎯 Starting Core Applications...${NC}"

# InstallSure Backend (Critical - Must start first)
start_app "InstallSure Backend" "applications/installsure/backend" 8000 "API Server" true

# InstallSure Frontend (Critical - Main Application)
start_app "InstallSure Frontend" "applications/installsure/frontend" 3000 "Construction Management Platform" true

# Demo Dashboard (Important for demonstration)
start_app "Demo Dashboard" "applications/demo-dashboard" 3001 "Central Control Panel" false

# Optional applications (Development/Demo purposes)
echo -e "\n${CYAN}📱 Starting Optional Applications...${NC}"

start_app "FF4U" "applications/ff4u" 3002 "Adult Entertainment Platform"
start_app "RedEye" "applications/redeye" 3003 "Project Management System"
start_app "ZeroStack" "applications/zerostack" 3004 "Infrastructure Management"
start_app "Hello" "applications/hello" 3005 "Digital Business Cards"
start_app "Avatar" "applications/avatar" 3006 "AI Avatar Platform"

# Wait for core applications to start
echo -e "\n${YELLOW}⏳ Waiting for core applications to initialize...${NC}"
sleep 15

# Enhanced health check with retry logic
echo -e "\n${CYAN}🔍 Performing Health Checks...${NC}"
echo -e "${CYAN}=================================${NC}"

test_app_health() {
    local app_name="$1"
    local port="$2"
    local url="$3"
    local critical="$4"
    local max_retries="${5:-3}"
    
    for ((i=1; i<=max_retries; i++)); do
        if curl -s --max-time 10 "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $app_name - Healthy on port $port${NC}"
            return 0
        fi
        if [ $i -eq $max_retries ]; then
            if [ "$critical" = "true" ]; then
                echo -e "${RED}❌ CRITICAL $app_name - Not responding on port $port${NC}"
            else
                echo -e "${YELLOW}⚠️  WARNING $app_name - Not responding on port $port${NC}"
            fi
            return 1
        fi
        sleep 5
    done
    return 1
}

# Test core applications
critical_healthy=true

test_app_health "InstallSure Backend" 8000 "http://localhost:8000/api/health" true || critical_healthy=false
test_app_health "InstallSure Frontend" 3000 "http://localhost:3000" true || critical_healthy=false
test_app_health "Demo Dashboard" 3001 "http://localhost:3001" false || true

# Test optional applications
test_app_health "FF4U" 3002 "http://localhost:3002" false || true
test_app_health "RedEye" 3003 "http://localhost:3003" false || true
test_app_health "ZeroStack" 3004 "http://localhost:3004" false || true
test_app_health "Hello" 3005 "http://localhost:3005" false || true
test_app_health "Avatar" 3006 "http://localhost:3006" false || true

# Final status
echo -e "\n${GREEN}🎉 Startup Summary${NC}"
echo -e "${CYAN}=================================${NC}"

if [ "$critical_healthy" = "true" ]; then
    echo -e "${GREEN}✅ SYSTEM READY - All critical applications are running${NC}"
else
    echo -e "${RED}❌ SYSTEM DEGRADED - Some critical applications failed to start${NC}"
fi

echo -e "\n${YELLOW}🌐 Application URLs:${NC}"
echo -e "   ${WHITE}• InstallSure:     http://localhost:3000${NC}"
echo -e "   ${WHITE}• Demo Dashboard:  http://localhost:3001${NC}"
echo -e "   ${WHITE}• Backend API:     http://localhost:8000${NC}"
echo -e "\n${CYAN}💡 Management Commands:${NC}"
echo -e "   ${GRAY}• Stop All:   ./scripts/stop-all.sh${NC}"
echo -e "   ${GRAY}• Test All:   ./scripts/test-all.sh${NC}"
echo -e "   ${GRAY}• Preflight:  ./tools/preflight-check.sh${NC}"