#!/bin/bash
# Test API - Quick smoke test for all endpoints

set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"

echo "🧪 Testing InstallSure API Endpoints"
echo "===================================="

# Test 1: Health Check
echo ""
echo "Test 1: Health Check"
echo "--------------------"
HEALTH=$(curl -sSf "$BACKEND_URL/api/health")
if [ $? -eq 0 ]; then
  echo "✅ Health endpoint responding"
  echo "$HEALTH" | jq '.'
else
  echo "❌ Health endpoint failed"
  exit 1
fi

# Test 2: Models Translate
echo ""
echo "Test 2: Models Translate"
echo "------------------------"
TRANSLATE=$(curl -sS -X POST "$BACKEND_URL/api/models/translate" \
  -H "Content-Type: application/json" \
  -d '{"blueprint":"Test House","urn":"urn:test:123","sheets":["test.pdf"],"meta":{"sqft":1000}}')
if [ $? -eq 0 ]; then
  echo "✅ Models translate endpoint responding"
  echo "$TRANSLATE" | jq '.'
else
  echo "❌ Models translate failed"
  exit 1
fi

# Test 3: Takeoff Sync
echo ""
echo "Test 3: Takeoff Sync"
echo "--------------------"
SYNC=$(curl -sS -X POST "$BACKEND_URL/api/takeoff/sync")
if [ $? -eq 0 ]; then
  echo "✅ Takeoff sync endpoint responding"
  echo "$SYNC" | jq '.'
else
  echo "❌ Takeoff sync failed"
  exit 1
fi

# Test 4: Takeoff Items
echo ""
echo "Test 4: Takeoff Items"
echo "---------------------"
ITEMS=$(curl -sS "$BACKEND_URL/api/takeoff/items")
if [ $? -eq 0 ]; then
  ITEM_COUNT=$(echo "$ITEMS" | jq '.data | length')
  echo "✅ Takeoff items endpoint responding ($ITEM_COUNT items)"
  echo "$ITEMS" | jq '.'
else
  echo "❌ Takeoff items failed"
  exit 1
fi

# Test 5: Estimate Lines
echo ""
echo "Test 5: Estimate Lines"
echo "----------------------"
ESTIMATE=$(curl -sS "$BACKEND_URL/api/estimate/lines")
if [ $? -eq 0 ]; then
  ESTIMATE_COUNT=$(echo "$ESTIMATE" | jq '.data | length')
  echo "✅ Estimate lines endpoint responding ($ESTIMATE_COUNT lines)"
  echo "$ESTIMATE" | jq '.'
else
  echo "❌ Estimate lines failed"
  exit 1
fi

echo ""
echo "===================================="
echo "✅ All tests passed!"
echo "===================================="
