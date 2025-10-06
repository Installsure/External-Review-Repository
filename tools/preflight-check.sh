#!/bin/bash
# Preflight Check Script - macOS/Linux
# External Review Repository
# Last Updated: 2025-10-06

set -euo pipefail

echo "🔍 Running Preflight Check..."
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

all_checks_passed=true

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
check_node() {
    echo -e "\n${YELLOW}🔄 Checking Node.js...${NC}"
    
    if command_exists node; then
        node_version=$(node -v)
        node_major=$(echo "$node_version" | sed 's/v//' | cut -d. -f1)
        
        if [ "$node_major" -ge 20 ]; then
            echo -e "   ${GREEN}✅ Node.js $node_version is installed (minimum v20.0.0)${NC}"
            return 0
        else
            echo -e "   ${RED}❌ Node.js $node_version < v20.0.0 (upgrade required)${NC}"
            return 1
        fi
    else
        echo -e "   ${RED}❌ Node.js is not installed or not in PATH${NC}"
        echo -e "   ${RED}Install Node.js >= 20.0.0 from https://nodejs.org${NC}"
        return 1
    fi
}

# Check npm
check_npm() {
    echo -e "\n${YELLOW}🔄 Checking npm...${NC}"
    
    if command_exists npm; then
        npm_version=$(npm -v)
        echo -e "   ${GREEN}✅ npm $npm_version is installed${NC}"
        return 0
    else
        echo -e "   ${RED}❌ npm is not installed${NC}"
        return 1
    fi
}

# Check port availability
check_ports() {
    echo -e "\n${YELLOW}🌐 Checking Port Availability...${NC}"
    
    ports=(3000 3001 8000)
    all_ports_available=true
    
    for port in "${ports[@]}"; do
        if lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "   ${RED}❌ Port $port is already in use${NC}"
            all_ports_available=false
        else
            echo -e "   ${GREEN}✅ Port $port is available${NC}"
        fi
    done
    
    if [ "$all_ports_available" = false ]; then
        echo -e "\n${YELLOW}💡 Stop running services and retry preflight check${NC}"
        return 1
    fi
    
    return 0
}

# Run all checks
echo -e "\n${BLUE}Running system checks...${NC}"

if ! check_node; then
    all_checks_passed=false
fi

if ! check_npm; then
    all_checks_passed=false
fi

if ! check_ports; then
    all_checks_passed=false
fi

# Results
echo -e "\n${BLUE}📊 Preflight Check Results...${NC}"
echo "================================="

if [ "$all_checks_passed" = true ]; then
    echo -e "${GREEN}✅ All preflight checks passed!${NC}"
    echo -e "${GREEN}🚀 Ready to start development${NC}"
    echo -e "\n${YELLOW}💡 Next steps:${NC}"
    echo -e "   ${NC}npm install${NC}"
    echo -e "   ${NC}./scripts/start-all.sh${NC}"
else
    echo -e "${RED}❌ Some preflight checks failed!${NC}"
    echo -e "${YELLOW}💡 Fix the issues above before proceeding${NC}"
    exit 1
fi

echo -e "\n${BLUE}🔍 Preflight check completed!${NC}"