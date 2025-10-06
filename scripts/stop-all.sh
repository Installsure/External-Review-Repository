#!/bin/bash
# Stop All Applications Script - Cross-Platform
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

echo -e "${RED}🛑 Stopping All Applications...${NC}"
echo -e "${CYAN}=================================${NC}"

# Enhanced function to stop processes with better error handling
stop_app() {
    local app_name="$1"
    local port="$2"
    local critical="${3:-false}"
    
    echo -e "\n${YELLOW}🔄 Stopping $app_name on port $port...${NC}"
    
    # Find processes using the port (cross-platform)
    local pids=""
    if command -v lsof &> /dev/null; then
        pids=$(lsof -ti :$port 2>/dev/null || true)
    elif command -v netstat &> /dev/null; then
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            pids=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 || true)
        fi
    fi
    
    if [ -n "$pids" ]; then
        for pid in $pids; do
            if [ -n "$pid" ] && [ "$pid" != "-" ]; then
                local process_name=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
                echo -e "   ${GRAY}🎯 Found process: $process_name (PID: $pid)${NC}"
                
                # Try graceful shutdown first
                if kill -TERM $pid 2>/dev/null; then
                    echo -e "   ${GREEN}✅ Process stopped gracefully${NC}"
                    sleep 2
                    
                    # Check if still running, force kill if needed
                    if kill -0 $pid 2>/dev/null; then
                        kill -KILL $pid 2>/dev/null || true
                        echo -e "   ${YELLOW}⚡ Process force-killed${NC}"
                    fi
                else
                    echo -e "   ${YELLOW}⚠️  Process already stopped or inaccessible${NC}"
                fi
            fi
        done
    else
        echo -e "   ${GRAY}ℹ️  No processes found on port $port${NC}"
    fi
}

# Stop core applications first (reverse order)
echo -e "\n${CYAN}🎯 Stopping Core Applications...${NC}"

stop_app "InstallSure Frontend" 3000 true
stop_app "InstallSure Backend" 8000 true
stop_app "Demo Dashboard" 3001 false

# Stop optional applications
echo -e "\n${CYAN}📱 Stopping Optional Applications...${NC}"

stop_app "FF4U" 3002
stop_app "RedEye" 3003
stop_app "ZeroStack" 3004
stop_app "Hello" 3005
stop_app "Avatar" 3006

# Stop Redis container if running
if command -v docker &> /dev/null; then
    echo -e "\n${YELLOW}🔄 Stopping Redis container...${NC}"
    if docker stop redis-installsure 2>/dev/null; then
        echo -e "   ${GREEN}✅ Redis container stopped${NC}"
    else
        echo -e "   ${GRAY}ℹ️  Redis container was not running${NC}"
    fi
fi

# Enhanced cleanup with better process detection
echo -e "\n${YELLOW}🧹 Enhanced Cleanup...${NC}"

# Stop npm/node processes more intelligently
process_names=("node" "npm" "vite" "webpack")
for process_name in "${process_names[@]}"; do
    # Find processes by name
    pids=$(pgrep "$process_name" 2>/dev/null || true)
    if [ -n "$pids" ]; then
        for pid in $pids; do
            # Check if it's related to our project
            cmd_line=$(ps -p $pid -o args= 2>/dev/null || true)
            if [[ "$cmd_line" == *"installsure"* ]] || [[ "$cmd_line" == *"demo-dashboard"* ]] || [[ "$cmd_line" == *"External-Review"* ]]; then
                echo -e "   ${GRAY}🎯 Stopping $process_name process: PID $pid${NC}"
                kill -TERM $pid 2>/dev/null || true
                sleep 1
                if kill -0 $pid 2>/dev/null; then
                    kill -KILL $pid 2>/dev/null || true
                fi
                echo -e "   ${GREEN}✅ $process_name process stopped${NC}"
            fi
        done
    fi
done

# Wait for processes to fully stop
sleep 3

# Enhanced verification with detailed reporting
echo -e "\n${CYAN}🔍 System Status Verification...${NC}"
echo -e "${CYAN}=================================${NC}"

ports=(3000 3001 8000 3002 3003 3004 3005 3006)
port_names=("InstallSure Frontend" "Demo Dashboard" "InstallSure Backend" "FF4U" "RedEye" "ZeroStack" "Hello" "Avatar")
all_ports_free=true

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${port_names[$i]}
    
    # Check if port is still in use
    if command -v lsof &> /dev/null; then
        port_in_use=$(lsof -i :$port 2>/dev/null || true)
    elif command -v netstat &> /dev/null; then
        port_in_use=$(netstat -tuln 2>/dev/null | grep ":$port " || true)
    else
        port_in_use=""
    fi
    
    if [ -n "$port_in_use" ]; then
        echo -e "${RED}❌ $name - Port $port is still in use${NC}"
        all_ports_free=false
    else
        echo -e "${GREEN}✅ $name - Port $port is free${NC}"
    fi
done

# Check remaining processes
remaining_processes=$(pgrep "node|npm" 2>/dev/null || true)
if [ -n "$remaining_processes" ]; then
    echo -e "\n${YELLOW}⚠️  Warning: Some Node.js/npm processes are still running${NC}"
    for pid in $remaining_processes; do
        process_name=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
        echo -e "   ${GRAY}• $process_name (PID: $pid)${NC}"
    done
fi

# Final status report
echo -e "\n${GREEN}🎉 Shutdown Summary${NC}"
echo -e "${CYAN}=================================${NC}"

if [ "$all_ports_free" = true ]; then
    echo -e "${GREEN}✅ SUCCESS - All applications stopped cleanly${NC}"
    echo -e "${GREEN}✅ All ports are now available${NC}"
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}✅ Redis container stopped${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  PARTIAL SUCCESS - Some ports may still be in use${NC}"
    echo -e "${YELLOW}💡 You may need to manually kill remaining processes${NC}"
fi

echo -e "\n${CYAN}💡 Management Commands:${NC}"
echo -e "   ${GRAY}• Start All:  ./scripts/start-all.sh${NC}"
echo -e "   ${GRAY}• Test All:   ./scripts/test-all.sh${NC}"
echo -e "   ${GRAY}• Preflight:  ./tools/preflight-check.sh${NC}"