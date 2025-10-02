#!/bin/bash

# API Smoke Test Script
# Tests all 4 new endpoints with sample payloads

set -e

echo "🧪 Running API Smoke Tests..."
echo "====================================="

BASE_URL="${API_BASE_URL:-http://localhost:8000}"
FAILED=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function to test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  
  echo ""
  echo "Testing: $description"
  echo "Endpoint: $method $endpoint"
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>&1)
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$BASE_URL$endpoint" 2>&1)
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    echo "Response: $body" | head -c 200
    echo ""
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
    echo "Response: $body"
    FAILED=$((FAILED + 1))
  fi
}

# Test 1: POST /api/models/translate
test_endpoint "POST" "/api/models/translate" \
  '{"urn":"test-urn-123","format":"svf2"}' \
  "Model Translation"

# Test 2: POST /api/takeoff/sync
test_endpoint "POST" "/api/takeoff/sync" \
  '{"projectId":"project-1","modelUrn":"test-urn-123"}' \
  "Takeoff Sync"

# Test 3: GET /api/takeoff/items
test_endpoint "GET" "/api/takeoff/items?projectId=project-1" \
  "" \
  "Takeoff Items"

# Test 4: GET /api/estimate/lines
test_endpoint "GET" "/api/estimate/lines?projectId=project-1" \
  "" \
  "Estimate Lines"

# Summary
echo ""
echo "====================================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ $FAILED test(s) failed${NC}"
  exit 1
fi
