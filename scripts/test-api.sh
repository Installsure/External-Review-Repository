#!/bin/bash

# Quick API Test Script
# Tests all InstallSure API endpoints

BASE_URL="http://localhost:8080/api"

echo "🧪 Testing InstallSure API Endpoints"
echo "======================================"

echo -e "\n📊 Testing Health Check..."
curl -s $BASE_URL/health | python3 -m json.tool

echo -e "\n\n🔄 Testing Model Translation..."
curl -s -X POST $BASE_URL/models/translate \
  -H "Content-Type: application/json" \
  -d @samples/sample_blueprint.json | python3 -m json.tool

echo -e "\n\n🔁 Testing Takeoff Sync..."
curl -s -X POST $BASE_URL/takeoff/sync | python3 -m json.tool

echo -e "\n\n📦 Testing Takeoff Items..."
curl -s $BASE_URL/takeoff/items | python3 -m json.tool

echo -e "\n\n💰 Testing Estimate Lines..."
curl -s $BASE_URL/estimate/lines | python3 -m json.tool

echo -e "\n\n✅ All tests completed!"
