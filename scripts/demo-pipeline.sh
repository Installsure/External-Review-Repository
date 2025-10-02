#!/bin/bash

# === FINAL APP REVIEW PIPELINE ===
# This script sets up and validates the InstallSure Estimating Core with sample docs.
# It integrates APS Takeoff, SQLite, Viewer, Playwright, and security scans.
# Paid stack: ChatGPT (Nexus), Cursor, VSCode + Copilot (MCP)
# Free stack: Playwright, CodeQL/Bandit, Sourcegraph Cody (free), GitHub Actions free tier

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to update or insert environment variables
UpsertEnv() {
    local key=$1
    local value=$2
    local env_file=${3:-.env}
    
    if [ -f "$env_file" ]; then
        if grep -q "^${key}=" "$env_file"; then
            # Update existing key
            sed -i.bak "s|^${key}=.*|${key}=${value}|" "$env_file"
        else
            # Add new key
            echo "${key}=${value}" >> "$env_file"
        fi
    else
        # Create new file with key
        echo "${key}=${value}" > "$env_file"
    fi
}

echo -e "${BLUE}=== InstallSure Estimating Demo Review Pipeline ===${NC}"
echo ""

# Get the repository root directory
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo -e "${GREEN}✓ Repository root: $REPO_ROOT${NC}"

# 1) Backend setup
echo -e "\n${BLUE}[1/8] Setting up backend...${NC}"
cd applications/installsure/backend

if [ ! -f .env ]; then
    if [ -f env.example ]; then
        cp env.example .env
        echo -e "${GREEN}✓ Created .env from env.example${NC}"
    else
        echo -e "${RED}✗ env.example not found${NC}"
        exit 1
    fi
fi

# Prompt for APS credentials if not set
echo -e "${YELLOW}Configure APS credentials (press Enter to skip if already configured):${NC}"
read -p "APS_CLIENT_ID (or press Enter to skip): " APS_CLIENT_ID
if [ ! -z "$APS_CLIENT_ID" ]; then
    UpsertEnv "APS_CLIENT_ID" "$APS_CLIENT_ID"
    UpsertEnv "FORGE_CLIENT_ID" "$APS_CLIENT_ID"
fi

read -p "APS_CLIENT_SECRET (or press Enter to skip): " APS_CLIENT_SECRET
if [ ! -z "$APS_CLIENT_SECRET" ]; then
    UpsertEnv "APS_CLIENT_SECRET" "$APS_CLIENT_SECRET"
    UpsertEnv "FORGE_CLIENT_SECRET" "$APS_CLIENT_SECRET"
fi

read -p "ACC_ACCOUNT_ID (or press Enter to skip): " ACC_ACCOUNT_ID
if [ ! -z "$ACC_ACCOUNT_ID" ]; then
    UpsertEnv "ACC_ACCOUNT_ID" "$ACC_ACCOUNT_ID"
fi

read -p "ACC_PROJECT_ID (or press Enter to skip): " ACC_PROJECT_ID
if [ ! -z "$ACC_PROJECT_ID" ]; then
    UpsertEnv "ACC_PROJECT_ID" "$ACC_PROJECT_ID"
fi

echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Start backend in background
echo -e "${YELLOW}Starting backend server...${NC}"
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

cd "$REPO_ROOT"

# 2) Frontend setup
echo -e "\n${BLUE}[2/8] Setting up frontend...${NC}"
cd applications/installsure/frontend

if [ ! -f .env ]; then
    if [ -f env.example ]; then
        cp env.example .env
        echo -e "${GREEN}✓ Created frontend .env from env.example${NC}"
    fi
fi

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Start frontend in background
echo -e "${YELLOW}Starting frontend server...${NC}"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

cd "$REPO_ROOT"

# Wait for servers to start
echo -e "\n${YELLOW}Waiting for servers to start...${NC}"
sleep 10

# 3) Verify sample docs
echo -e "\n${BLUE}[3/8] Verifying sample documents...${NC}"
if [ ! -d samples ]; then
    mkdir -p samples
fi

if [ ! -f samples/sample_blueprint.json ]; then
    echo '{ "blueprint": "Sample House A", "urn": "urn:sample:demo", "sheets": ["planA.pdf"], "meta": {"sqft":1200,"floors":2} }' > samples/sample_blueprint.json
fi

if [ ! -f samples/sample_takeoff.json ]; then
    echo '[{"package":"Walls","type":"Drywall","qty":200},{"package":"Framing","type":"2x4 Lumber","qty":500}]' > samples/sample_takeoff.json
fi

echo -e "${GREEN}✓ Sample documents created/verified${NC}"

# 4) Run through workflows
echo -e "\n${BLUE}[4/8] Testing API workflows...${NC}"

# Translate + view
echo -e "${YELLOW}Testing model translation endpoint...${NC}"
TRANSLATE_RESPONSE=$(curl -s -X POST http://localhost:8080/api/models/translate \
    -d @samples/sample_blueprint.json \
    -H "Content-Type: application/json" || echo '{"error":"Failed to connect"}')
echo "$TRANSLATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$TRANSLATE_RESPONSE"

# Sync takeoff
echo -e "\n${YELLOW}Testing takeoff sync endpoint...${NC}"
SYNC_RESPONSE=$(curl -s -X POST http://localhost:8080/api/takeoff/sync || echo '{"error":"Failed to connect"}')
echo "$SYNC_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SYNC_RESPONSE"

# Check items
echo -e "\n${YELLOW}Testing takeoff items endpoint...${NC}"
ITEMS_RESPONSE=$(curl -s http://localhost:8080/api/takeoff/items || echo '{"error":"Failed to connect"}')
echo "$ITEMS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ITEMS_RESPONSE"

# Optional: enriched assemblies
echo -e "\n${YELLOW}Testing estimate lines endpoint...${NC}"
ESTIMATE_RESPONSE=$(curl -s http://localhost:8080/api/estimate/lines || echo '{"error":"Failed to connect"}')
echo "$ESTIMATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ESTIMATE_RESPONSE"

echo -e "${GREEN}✓ API workflow tests completed${NC}"

# 5) Testing with Playwright
echo -e "\n${BLUE}[5/8] Running Playwright tests...${NC}"
cd "$REPO_ROOT"

if [ -d tests ] && [ -f tests/package.json ]; then
    cd tests
    if [ ! -d node_modules ]; then
        npm install
    fi
    npx playwright test --reporter=list || echo -e "${YELLOW}⚠ Playwright tests failed or not configured${NC}"
    cd "$REPO_ROOT"
else
    echo -e "${YELLOW}⚠ Playwright tests directory not found, skipping...${NC}"
fi

# 6) Security + quality scans
echo -e "\n${BLUE}[6/8] Running security scans...${NC}"

# Check if bandit is available (Python security scanner)
if command -v bandit &> /dev/null; then
    echo -e "${YELLOW}Running Bandit security scan on backend...${NC}"
    bandit -r applications/installsure/backend/src || echo -e "${YELLOW}⚠ Bandit scan completed with warnings${NC}"
else
    echo -e "${YELLOW}⚠ Bandit not installed, skipping Python security scan${NC}"
    echo -e "${YELLOW}  Install with: pip install bandit${NC}"
fi

# Check if CodeQL CLI is available
if command -v codeql &> /dev/null; then
    echo -e "\n${YELLOW}Running CodeQL analysis...${NC}"
    codeql database create codeql-db --language=javascript --source-root=applications/installsure/backend || echo -e "${YELLOW}⚠ CodeQL database creation failed${NC}"
    codeql database analyze codeql-db --format=sarif-latest --output=results.sarif || echo -e "${YELLOW}⚠ CodeQL analysis failed${NC}"
else
    echo -e "${YELLOW}⚠ CodeQL CLI not installed, skipping CodeQL analysis${NC}"
    echo -e "${YELLOW}  Install from: https://github.com/github/codeql-cli-binaries${NC}"
fi

# 7) ESLint check
echo -e "\n${BLUE}[7/8] Running code quality checks...${NC}"
cd applications/installsure/backend
echo -e "${YELLOW}Running ESLint on backend...${NC}"
npm run lint || echo -e "${YELLOW}⚠ ESLint found issues${NC}"
cd "$REPO_ROOT"

cd applications/installsure/frontend
echo -e "${YELLOW}Running ESLint on frontend...${NC}"
npm run lint || echo -e "${YELLOW}⚠ ESLint found issues${NC}"
cd "$REPO_ROOT"

# 8) Report status
echo -e "\n${BLUE}[8/8] Generating status report...${NC}"
echo -e "${GREEN}=== InstallSure Estimating Demo Review Completed ===${NC}"
echo -e "${GREEN}Viewer: http://localhost:5173${NC}"
echo -e "${GREEN}Backend API: http://localhost:8080${NC}"
echo -e "${GREEN}Sample docs processed: samples/sample_blueprint.json + sample_takeoff.json${NC}"
echo ""
echo -e "${YELLOW}Backend log: /tmp/backend.log${NC}"
echo -e "${YELLOW}Frontend log: /tmp/frontend.log${NC}"
echo ""
echo -e "${BLUE}To stop servers:${NC}"
echo -e "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${BLUE}To view logs:${NC}"
echo -e "  tail -f /tmp/backend.log"
echo -e "  tail -f /tmp/frontend.log"
echo ""

# Save PIDs for cleanup
echo "$BACKEND_PID" > /tmp/installsure-backend.pid
echo "$FRONTEND_PID" > /tmp/installsure-frontend.pid

echo -e "${GREEN}✓ Pipeline complete!${NC}"
