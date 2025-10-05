#!/bin/bash
# Quick validation script to ensure services are working

set -e

echo "============================================"
echo "  InstallSure System Validation"
echo "============================================"
echo ""

# Check if backend is running
echo "▶ Checking backend health..."
HEALTH=$(curl -s http://127.0.0.1:8099/api/health || echo "failed")
if echo "$HEALTH" | grep -q "\"ok\":true"; then
    echo "✓ Backend is healthy"
else
    echo "✗ Backend is not responding"
    exit 1
fi

# Test projects endpoint
echo "▶ Testing projects API..."
PROJECTS=$(curl -s http://127.0.0.1:8099/api/projects || echo "failed")
if echo "$PROJECTS" | grep -q "\"success\":true"; then
    echo "✓ Projects API working"
else
    echo "✗ Projects API failed"
    exit 1
fi

# Test creating a tag
echo "▶ Testing tag creation..."
TAG=$(curl -s -X POST http://127.0.0.1:8099/api/tags \
    -H "Content-Type: application/json" \
    -d '{"plan_id":"test","x":0.5,"y":0.5,"type":"RFI","label":"Test"}' || echo "failed")
if echo "$TAG" | grep -q "\"success\":true"; then
    echo "✓ Tag creation working"
else
    echo "✗ Tag creation failed"
    exit 1
fi

# Test creating an RFI
echo "▶ Testing RFI creation..."
RFI=$(curl -s -X POST http://127.0.0.1:8099/api/rfis \
    -H "Content-Type: application/json" \
    -d '{"title":"Test RFI","description":"Test","project_id":"1"}' || echo "failed")
if echo "$RFI" | grep -q "\"success\":true"; then
    echo "✓ RFI creation working"
else
    echo "✗ RFI creation failed"
    exit 1
fi

# Test listing RFIs
echo "▶ Testing RFI listing..."
RFIS=$(curl -s http://127.0.0.1:8099/api/rfis || echo "failed")
if echo "$RFIS" | grep -q "\"success\":true"; then
    echo "✓ RFI listing working"
else
    echo "✗ RFI listing failed"
    exit 1
fi

echo ""
echo "============================================"
echo "  ✓ All API tests passed!"
echo "============================================"
