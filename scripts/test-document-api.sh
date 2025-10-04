#!/bin/bash

# Test script for AIA library and residential demo functionality
# This tests the new document management endpoints

set -e

API_BASE="${API_BASE:-http://localhost:8000}"

echo "🧪 Testing Document Management API"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1${NC}"
  else
    echo -e "${RED}❌ $1${NC}"
    exit 1
  fi
}

info() {
  echo -e "${BLUE}ℹ️ $1${NC}"
}

# 1. Verify server is running
echo "Checking if server is running at ${API_BASE}..."
curl -s -f "${API_BASE}/api/health" > /dev/null
check "Server is online"

# 2. Test AIA library ingestion
echo ""
info "Testing AIA library ingestion..."
RESPONSE=$(curl -s -X POST "${API_BASE}/api/docs/ingestAIA")
echo "$RESPONSE" | jq '.'
if echo "$RESPONSE" | jq -e '.ok' > /dev/null; then
  if echo "$RESPONSE" | jq -e '.error' > /dev/null; then
    info "AIA ingest skipped: $(echo $RESPONSE | jq -r '.error')"
  else
    info "AIA ingest -> $(echo $RESPONSE | jq -r '.count') items"
  fi
else
  echo -e "${RED}❌ AIA library ingestion failed${NC}"
fi

# 3. Create sample RFI
echo ""
info "Creating sample RFI..."
RFI_RESPONSE=$(curl -s -X POST "${API_BASE}/api/docs/rfi" \
  -H "Content-Type: application/json" \
  -d '{
    "project": "DEMO",
    "sheet": "A1.1",
    "title": "Clarify exterior wall type @ grid B",
    "question": "Is exterior wall 2x6 with R-21 or 2x4 with R-13?",
    "reference": "A1.1 Wall Type Legend",
    "proposed": "Use 2x6 R-21 unless structural conflicts.",
    "due": "5 business days"
  }')

echo "$RFI_RESPONSE" | jq '.'
if echo "$RFI_RESPONSE" | jq -e '.ok and .rfi_id' > /dev/null; then
  check "RFI created"
  RFI_ID=$(echo "$RFI_RESPONSE" | jq -r '.rfi_id')
  RFI_PATH=$(echo "$RFI_RESPONSE" | jq -r '.path')
  info "RFI ID: $RFI_ID"
else
  echo -e "${RED}❌ RFI creation failed${NC}"
  exit 1
fi

# 4. Create sample Change Order
echo ""
info "Creating sample Change Order..."
CO_RESPONSE=$(curl -s -X POST "${API_BASE}/api/docs/co" \
  -H "Content-Type: application/json" \
  -d '{
    "project": "DEMO",
    "desc": "Upgrade ceiling insulation to R-38 blown",
    "cost": "$1,500.00",
    "time": "0",
    "reason": "Owner upgrade",
    "co_no": "CO-001"
  }')

echo "$CO_RESPONSE" | jq '.'
if echo "$CO_RESPONSE" | jq -e '.ok and .co_id' > /dev/null; then
  check "Change Order created"
  CO_ID=$(echo "$CO_RESPONSE" | jq -r '.co_id')
  CO_PATH=$(echo "$CO_RESPONSE" | jq -r '.path')
  info "CO ID: $CO_ID"
else
  echo -e "${RED}❌ Change Order creation failed${NC}"
  exit 1
fi

# 5. Test Residential Demo
echo ""
info "Testing residential demo..."
DEMO_RESPONSE=$(curl -s -X POST "${API_BASE}/api/demo/residential")
echo "$DEMO_RESPONSE" | jq '.'
if echo "$DEMO_RESPONSE" | jq -e '.ok' > /dev/null; then
  if echo "$DEMO_RESPONSE" | jq -e '.error' > /dev/null; then
    info "Residential demo skipped: $(echo $DEMO_RESPONSE | jq -r '.error')"
  else
    info "Residential demo completed successfully"
    PLAN_PATH=$(echo "$DEMO_RESPONSE" | jq -r '.plan // "N/A"')
    info "Plan: $PLAN_PATH"
  fi
else
  echo -e "${RED}❌ Residential demo failed${NC}"
fi

# Summary
echo ""
echo "=== SUMMARY ==="
echo "RFI: $RFI_ID -> $RFI_PATH"
echo "CO:  $CO_ID  -> $CO_PATH"
echo ""
echo "All tests completed! ✅"
echo ""
echo "To customize:"
echo "  - Edit aia-library.manifest.json (add licensed AIA/waiver/RFI/Submittal URLs)"
echo "  - Edit residential-plan.manifest.json (set an open/public plan URL)"
echo ""
