# InstallSure API Endpoints - Quick Reference

## Base URL
```
http://localhost:8080/api
```

## Health Check

### GET `/health`
Returns server health status and service connectivity.

**Response:**
```json
{
  "ok": true,
  "timestamp": "2025-10-02T17:15:25.322Z",
  "uptime": 19.401392153,
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "database": "connected",
    "redis": "connected",
    "forge": "configured"
  }
}
```

## Model Translation

### POST `/models/translate`
Translates a blueprint model using Autodesk Platform Services.

**Request Body:**
```json
{
  "blueprint": "Sample House A",
  "urn": "urn:sample:demo",
  "sheets": ["planA.pdf"],
  "meta": {
    "sqft": 1200,
    "floors": 2
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "blueprint": "Sample House A",
    "urn": "urn:sample:demo",
    "sheets": ["planA.pdf"],
    "meta": {
      "sqft": 1200,
      "floors": 2
    },
    "translationJobId": "translation-1759425333743",
    "status": "processing"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/models/translate \
  -H "Content-Type: application/json" \
  -d @samples/sample_blueprint.json
```

## Takeoff Sync

### POST `/takeoff/sync`
Synchronizes takeoff data with the backend.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Takeoff data synchronized",
    "syncedAt": "2025-10-02T17:15:42.997Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/takeoff/sync
```

## Takeoff Items

### GET `/takeoff/items`
Retrieves the list of takeoff items.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "package": "Walls",
        "type": "Drywall",
        "qty": 200,
        "unit": "sheets"
      },
      {
        "package": "Framing",
        "type": "2x4 Lumber",
        "qty": 500,
        "unit": "pieces"
      }
    ]
  }
}
```

**cURL Example:**
```bash
curl http://localhost:8080/api/takeoff/items
```

## Estimate Lines

### GET `/estimate/lines`
Retrieves enriched assembly data with cost estimates.

**Response:**
```json
{
  "success": true,
  "data": {
    "lines": [
      {
        "package": "Walls",
        "type": "Drywall",
        "qty": 200,
        "unit": "sheets",
        "unitCost": 12.5,
        "totalCost": 2500,
        "laborHours": 40
      },
      {
        "package": "Framing",
        "type": "2x4 Lumber",
        "qty": 500,
        "unit": "pieces",
        "unitCost": 3.75,
        "totalCost": 1875,
        "laborHours": 60
      }
    ],
    "totalCost": 4375,
    "totalLaborHours": 100
  }
}
```

**cURL Example:**
```bash
curl http://localhost:8080/api/estimate/lines
```

## Error Responses

### Missing Credentials
When APS/Forge credentials are not configured:

```json
{
  "success": false,
  "error": "FORGE_CLIENT_ID/SECRET missing",
  "message": "Configure Forge credentials to enable this feature"
}
```

### Not Found
For non-existent routes:

```json
{
  "success": false,
  "error": "Route not found",
  "path": "/api/invalid/path"
}
```

## Testing All Endpoints

Quick test script:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "Testing Health Check..."
curl -s $BASE_URL/health | python3 -m json.tool

echo -e "\n\nTesting Model Translation..."
curl -s -X POST $BASE_URL/models/translate \
  -H "Content-Type: application/json" \
  -d @samples/sample_blueprint.json | python3 -m json.tool

echo -e "\n\nTesting Takeoff Sync..."
curl -s -X POST $BASE_URL/takeoff/sync | python3 -m json.tool

echo -e "\n\nTesting Takeoff Items..."
curl -s $BASE_URL/takeoff/items | python3 -m json.tool

echo -e "\n\nTesting Estimate Lines..."
curl -s $BASE_URL/estimate/lines | python3 -m json.tool
```

Save as `test-api.sh`, make executable with `chmod +x test-api.sh`, and run with `./test-api.sh`.
