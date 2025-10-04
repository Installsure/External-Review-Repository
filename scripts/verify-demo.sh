#!/bin/bash
# Quick Demo Verification Script
# Verifies all applications are running and accessible
# External Review Repository

set -e

echo "🎬 E2E Demo Verification Script"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Application endpoints
declare -A apps=(
    ["Demo Dashboard"]="http://localhost:3001"
    ["InstallSure"]="http://localhost:3000"
    ["FF4U"]="http://localhost:3002"
    ["RedEye"]="http://localhost:3003"
    ["ZeroStack"]="http://localhost:3004"
    ["Hello"]="http://localhost:3005"
    ["Avatar"]="http://localhost:3006"
)

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl is not installed. Please install curl to run health checks.${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Checking Application Health...${NC}"
echo ""

success_count=0
fail_count=0

for app_name in "${!apps[@]}"; do
    url="${apps[$app_name]}"
    
    # Try to connect to the application
    if curl -s -f -o /dev/null -w "%{http_code}" --max-time 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $app_name${NC} - Running at $url"
        ((success_count++))
    else
        echo -e "${RED}❌ $app_name${NC} - Not responding at $url"
        ((fail_count++))
    fi
done

echo ""
echo "================================="
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   ${GREEN}✅ Success: $success_count/7${NC}"
echo -e "   ${RED}❌ Failed: $fail_count/7${NC}"
echo ""

if [ $success_count -eq 7 ]; then
    echo -e "${GREEN}🎉 All applications are running successfully!${NC}"
    echo ""
    echo -e "${BLUE}🚀 You can now start the demo:${NC}"
    echo "   1. Open http://localhost:3001 (Demo Dashboard)"
    echo "   2. Follow the E2E_DEMO_GUIDE.md for the full walkthrough"
    echo ""
    echo -e "${YELLOW}📚 Demo Credentials:${NC}"
    echo "   Email: demo@[app-name].com (e.g., demo@installsure.com)"
    echo "   Password: demo123"
    echo ""
    exit 0
elif [ $success_count -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some applications are not running.${NC}"
    echo ""
    echo "To start all applications, run:"
    echo "   ./scripts/start-all.sh    (Linux/macOS)"
    echo "   .\\scripts\\start-all.ps1  (Windows)"
    echo ""
    exit 1
else
    echo -e "${RED}❌ No applications are running.${NC}"
    echo ""
    echo "To start all applications, run:"
    echo "   ./scripts/start-all.sh    (Linux/macOS)"
    echo "   .\\scripts\\start-all.ps1  (Windows)"
    echo ""
    echo "Make sure you have installed dependencies first:"
    echo "   cd applications/demo-dashboard && npm install"
    echo "   cd applications/installsure && npm install"
    echo "   # ... repeat for all applications"
    echo ""
    exit 1
fi
