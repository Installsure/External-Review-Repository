# Nexus Calendar API

FastAPI backend for calendar event management.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
uvicorn server:app --reload --port 8000
```

Or specify a custom port:
```bash
uvicorn server:app --reload --port 8080
```

## API Endpoints

### GET /api/calendar/events
Retrieve calendar events for a project.

**Query Parameters:**
- `projectId` (optional, default: "DEMO") - Project identifier

**Response:**
```json
{
  "ok": true,
  "events": [
    {
      "id": "rfi-001",
      "title": "RFI 001 Response Due",
      "type": "RFI",
      "date": "2025-10-09T17:59:00.123456",
      "linked": "/docs/rfi/rfi-001.txt"
    }
  ]
}
```

### POST /api/calendar/events
Add a new calendar event.

**Request Body:**
```json
{
  "id": "custom-id",
  "title": "Event Title",
  "type": "General",
  "date": "2025-10-10T10:00:00",
  "linked": "/path/to/resource"
}
```

**Response:**
```json
{
  "ok": true,
  "event": {
    "id": "custom-id",
    "title": "Event Title",
    "type": "General",
    "date": "2025-10-10T10:00:00",
    "linked": "/path/to/resource"
  }
}
```

## Event Types

- RFI (Request for Information)
- Change Order
- Workforce
- Payment
- General

## Notes

- Events are currently stored in-memory (CAL_EVENTS list)
- Will be replaced with Postgres database in future
- Event dates are in ISO 8601 format
