#!/bin/bash
# InstallSure Smoke Test Script for Unix/Linux/macOS
# Runs backend, frontend, and all tests

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$REPO_ROOT/applications/installsure/backend"
FRONTEND_DIR="$REPO_ROOT/applications/installsure/frontend"
TESTS_DIR="$REPO_ROOT/tests"

BACKEND_PID=""
FRONTEND_PID=""
EXIT_CODE=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    
    if [ -n "$BACKEND_PID" ]; then
        echo -e "   ${GRAY}Stopping backend (PID: $BACKEND_PID)${NC}"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ -n "$FRONTEND_PID" ]; then
        echo -e "   ${GRAY}Stopping frontend (PID: $FRONTEND_PID)${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Kill any remaining processes on our ports
    lsof -ti:8099 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
}

trap cleanup EXIT

echo -e "${CYAN}=================================${NC}"
echo -e "${CYAN}InstallSure Smoke Test Suite${NC}"
echo -e "${CYAN}=================================${NC}"
echo ""

# Step 1: Install backend dependencies
echo -e "${CYAN}📦 Installing backend dependencies...${NC}"
cd "$BACKEND_DIR"
if [ -f "package.json" ]; then
    npm install --silent || npm install
fi
echo -e "   ${GREEN}✅ Backend dependencies installed${NC}"

# Step 2: Install frontend dependencies
echo -e "\n${CYAN}📦 Installing frontend dependencies...${NC}"
cd "$FRONTEND_DIR"
if [ -f "package.json" ]; then
    npm install --silent || npm install
fi
echo -e "   ${GREEN}✅ Frontend dependencies installed${NC}"

# Step 3: Install test dependencies
echo -e "\n${CYAN}📦 Installing test dependencies...${NC}"
cd "$TESTS_DIR"
if [ -f "package.json" ]; then
    npm install --silent || npm install
fi
echo -e "   ${GREEN}✅ Test dependencies installed${NC}"

# Step 4: Start backend
echo -e "\n${CYAN}🚀 Starting backend on http://127.0.0.1:8099...${NC}"
cd "$BACKEND_DIR"
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "   ${GRAY}Backend PID: $BACKEND_PID${NC}"

# Step 5: Start frontend
echo -e "\n${CYAN}🚀 Starting frontend on http://127.0.0.1:3000...${NC}"
cd "$FRONTEND_DIR"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "   ${GRAY}Frontend PID: $FRONTEND_PID${NC}"

# Step 6: Wait for services to be ready
echo -e "\n${CYAN}⏳ Waiting for services to start...${NC}"
MAX_WAIT=60
WAITED=0

while [ $WAITED -lt $MAX_WAIT ]; do
    if curl -s http://127.0.0.1:8099/health > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Backend is ready${NC}"
        break
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo -e "   ${GRAY}Waiting for backend... ($WAITED/$MAX_WAIT seconds)${NC}"
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo -e "   ${RED}❌ Backend did not start within $MAX_WAIT seconds${NC}"
    echo -e "\n${YELLOW}Backend logs:${NC}"
    tail -20 /tmp/backend.log
    exit 1
fi

WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Frontend is ready${NC}"
        break
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo -e "   ${GRAY}Waiting for frontend... ($WAITED/$MAX_WAIT seconds)${NC}"
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo -e "   ${RED}❌ Frontend did not start within $MAX_WAIT seconds${NC}"
    echo -e "\n${YELLOW}Frontend logs:${NC}"
    tail -20 /tmp/frontend.log
    exit 1
fi

# Step 7: Run backend tests
echo -e "\n${CYAN}🧪 Running backend tests...${NC}"
cd "$BACKEND_DIR"
if npm run test; then
    echo -e "   ${GREEN}✅ Backend tests passed${NC}"
else
    echo -e "   ${RED}❌ Backend tests failed${NC}"
    EXIT_CODE=1
fi

# Step 8: Install Playwright browsers
echo -e "\n${CYAN}🎭 Installing Playwright browsers...${NC}"
cd "$TESTS_DIR"
if npx playwright install --with-deps chromium; then
    echo -e "   ${GREEN}✅ Playwright browsers installed${NC}"
else
    echo -e "   ${YELLOW}⚠️  Playwright install had warnings (continuing)${NC}"
fi

# Step 9: Run E2E tests
echo -e "\n${CYAN}🧪 Running E2E tests...${NC}"
cd "$TESTS_DIR"
if npm test; then
    echo -e "   ${GREEN}✅ E2E tests passed${NC}"
else
    echo -e "   ${RED}❌ E2E tests failed${NC}"
    EXIT_CODE=1
fi

# Summary
echo -e "\n${CYAN}=================================${NC}"
echo -e "${CYAN}Summary${NC}"
echo -e "${CYAN}=================================${NC}"
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo -e "${GRAY}Backend: http://127.0.0.1:8099${NC}"
    echo -e "${GRAY}Frontend: http://127.0.0.1:3000${NC}"
else
    echo -e "${RED}❌ Some tests failed${NC}"
fi
echo ""

exit $EXIT_CODE
