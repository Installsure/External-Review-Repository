#!/bin/bash
# Demo Pipeline - InstallSure Estimating Core
# Runs the complete demo pipeline with all API endpoints

set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"

echo "🚀 InstallSure Demo Pipeline Starting..."
echo "================================================"

# Check if backend is running
if ! curl -sSf "$BACKEND_URL/api/health" > /dev/null 2>&1; then
  echo "❌ Backend is not running at $BACKEND_URL"
  echo "Please start the backend first with: cd applications/installsure/backend && npm run dev"
  exit 1
fi

echo "✅ Backend is healthy"
echo ""

# Create sample documents if they don't exist
mkdir -p samples
if [ ! -f samples/sample_blueprint.json ]; then
  echo '{ "blueprint":"Sample House A", "urn":"urn:sample:demo", "sheets":["planA.pdf"], "meta":{"sqft":1200,"floors":2} }' > samples/sample_blueprint.json
fi
if [ ! -f samples/sample_takeoff.json ]; then
  echo '[{"package":"Walls","type":"Drywall","qty":200,"unit":"sf"},{"package":"Framing","type":"2x4 Lumber","qty":500,"unit":"lf"}]' > samples/sample_takeoff.json
fi

echo "📋 Step 1: Model Translation"
echo "--------------------------------"
curl -sS -X POST "$BACKEND_URL/api/models/translate" \
  -H "Content-Type: application/json" \
  --data-binary @samples/sample_blueprint.json | jq '.'
echo ""

echo "📋 Step 2: Takeoff Sync"
echo "--------------------------------"
curl -sS -X POST "$BACKEND_URL/api/takeoff/sync" | jq '.'
echo ""

echo "📋 Step 3: Get Takeoff Items"
echo "--------------------------------"
ITEMS=$(curl -sS "$BACKEND_URL/api/takeoff/items")
echo "$ITEMS" | jq '.'
ITEM_COUNT=$(echo "$ITEMS" | jq '.data | length')
echo "Found $ITEM_COUNT items"
echo ""

echo "📋 Step 4: Get Estimate Lines"
echo "--------------------------------"
ESTIMATE=$(curl -sS "$BACKEND_URL/api/estimate/lines")
echo "$ESTIMATE" | jq '.'
ESTIMATE_COUNT=$(echo "$ESTIMATE" | jq '.data | length')
echo "Found $ESTIMATE_COUNT estimate lines"
echo ""

echo "================================================"
echo "✅ Demo Pipeline Complete!"
echo "   - Items processed: $ITEM_COUNT"
echo "   - Estimate lines: $ESTIMATE_COUNT"
echo "================================================"
