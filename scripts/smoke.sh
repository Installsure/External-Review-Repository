#!/bin/bash
# InstallSure Smoke Test Script - Unix/Linux/macOS
# Runs the complete application stack and validates functionality

set -e

# Colors for output
COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_CYAN='\033[0;36m'
COLOR_YELLOW='\033[0;33m'

TESTS_PASSED=0
TESTS_FAILED=0
BACKEND_PID=""
FRONTEND_PID=""

write_step() {
    echo -e "${COLOR_CYAN}▶ $1${COLOR_RESET}"
}

write_success() {
    echo -e "${COLOR_GREEN}✓ $1${COLOR_RESET}"
    ((TESTS_PASSED++))
}

write_failure() {
    echo -e "${COLOR_RED}✗ $1${COLOR_RESET}"
    ((TESTS_FAILED++))
}

cleanup() {
    write_step "Cleaning up..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        echo "  Stopped backend (PID: $BACKEND_PID)"
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        echo "  Stopped frontend (PID: $FRONTEND_PID)"
    fi
    # Kill any remaining node processes on our ports
    lsof -ti:8099 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
}

# Register cleanup on exit
trap cleanup EXIT

echo -e "${COLOR_CYAN}================================================================${COLOR_RESET}"
echo -e "${COLOR_CYAN}  InstallSure Smoke Test Suite${COLOR_RESET}"
echo -e "${COLOR_CYAN}================================================================${COLOR_RESET}"
echo ""

# Step 1: Install backend dependencies
write_step "Installing backend dependencies..."
cd applications/installsure/backend
if [ ! -d "node_modules" ]; then
    npm install --silent
fi
write_success "Backend dependencies ready"
cd ../../..

# Step 2: Install frontend dependencies
write_step "Installing frontend dependencies..."
cd applications/installsure/frontend
if [ ! -d "node_modules" ]; then
    npm install --silent
fi
write_success "Frontend dependencies ready"
cd ../../..

# Step 3: Start backend
write_step "Starting backend on port 8099..."
cd applications/installsure/backend
npm run dev > /tmp/installsure-backend.log 2>&1 &
BACKEND_PID=$!
echo "  Backend started (PID: $BACKEND_PID)"
cd ../../..

# Step 4: Start frontend
write_step "Starting frontend on port 3000..."
cd applications/installsure/frontend
npm run dev > /tmp/installsure-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "  Frontend started (PID: $FRONTEND_PID)"
cd ../../..

# Step 5: Wait for services to be ready
write_step "Waiting for services to be ready..."

MAX_ATTEMPTS=60
BACKEND_READY=false
FRONTEND_READY=false

for i in $(seq 1 $MAX_ATTEMPTS); do
    sleep 1
    
    if [ "$BACKEND_READY" = false ]; then
        if curl -s -f http://127.0.0.1:8099/api/health > /dev/null 2>&1; then
            BACKEND_READY=true
            echo "  Backend ready after $i seconds"
        fi
    fi
    
    if [ "$FRONTEND_READY" = false ]; then
        if curl -s -f http://127.0.0.1:3000 > /dev/null 2>&1; then
            FRONTEND_READY=true
            echo "  Frontend ready after $i seconds"
        fi
    fi
    
    if [ "$BACKEND_READY" = true ] && [ "$FRONTEND_READY" = true ]; then
        break
    fi
done

if [ "$BACKEND_READY" = false ]; then
    write_failure "Backend failed to start within $MAX_ATTEMPTS seconds"
    cat /tmp/installsure-backend.log
    exit 1
fi

if [ "$FRONTEND_READY" = false ]; then
    write_failure "Frontend failed to start within $MAX_ATTEMPTS seconds"
    cat /tmp/installsure-frontend.log
    exit 1
fi

write_success "All services are ready"

# Step 6: Install Playwright
write_step "Installing Playwright browsers..."
cd tests
if [ ! -d "node_modules" ]; then
    npm install --silent
fi
npx playwright install --with-deps chromium > /dev/null 2>&1 || true
write_success "Playwright browsers installed"
cd ..

# Step 7: Run Playwright tests
write_step "Running Playwright E2E tests..."
cd tests
if npx playwright test; then
    write_success "Playwright tests passed"
else
    write_failure "Playwright tests failed"
fi
cd ..

# Step 8: Run backend unit tests
write_step "Running backend unit tests..."
cd applications/installsure/backend
if npm run test > /dev/null 2>&1; then
    write_success "Backend tests passed"
else
    write_failure "Backend tests failed (non-critical)"
fi
cd ../../..

# Summary
echo ""
echo -e "${COLOR_CYAN}================================================================${COLOR_RESET}"
echo -e "${COLOR_CYAN}  Test Summary${COLOR_RESET}"
echo -e "${COLOR_CYAN}================================================================${COLOR_RESET}"
echo -e "  ${COLOR_GREEN}Passed: $TESTS_PASSED${COLOR_RESET}"
echo -e "  ${COLOR_RED}Failed: $TESTS_FAILED${COLOR_RESET}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "  ${COLOR_GREEN}✓ ALL TESTS PASSED${COLOR_RESET}"
    exit 0
else
    echo -e "  ${COLOR_RED}✗ SOME TESTS FAILED${COLOR_RESET}"
    exit 1
fi
