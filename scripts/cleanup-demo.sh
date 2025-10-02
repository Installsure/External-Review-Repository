#!/bin/bash

# Cleanup script for InstallSure demo pipeline

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping InstallSure demo servers...${NC}"

# Stop servers using saved PIDs
if [ -f /tmp/installsure-backend.pid ]; then
    BACKEND_PID=$(cat /tmp/installsure-backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend server stopped (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${YELLOW}⚠ Backend server already stopped${NC}"
    fi
    rm /tmp/installsure-backend.pid
fi

if [ -f /tmp/installsure-frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/installsure-frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend server stopped (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend server already stopped${NC}"
    fi
    rm /tmp/installsure-frontend.pid
fi

# Clean up log files
if [ -f /tmp/backend.log ]; then
    rm /tmp/backend.log
    echo -e "${GREEN}✓ Backend log cleaned up${NC}"
fi

if [ -f /tmp/frontend.log ]; then
    rm /tmp/frontend.log
    echo -e "${GREEN}✓ Frontend log cleaned up${NC}"
fi

echo -e "${GREEN}✓ Cleanup complete${NC}"
