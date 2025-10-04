from fastapi import FastAPI, Body
from datetime import datetime, timedelta
import time

app = FastAPI()

# In-memory events (replace with Postgres later)
CAL_EVENTS = [
    {
        "id": "rfi-001",
        "title": "RFI 001 Response Due",
        "type": "RFI",
        "date": (datetime.utcnow() + timedelta(days=5)).isoformat(),
        "linked": "/docs/rfi/rfi-001.txt"
    },
    {
        "id": "co-001",
        "title": "CO-001 Approval Deadline",
        "type": "Change Order",
        "date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
        "linked": "/docs/co/co-001.txt"
    },
    {
        "id": "safety-001",
        "title": "Toolbox Talk – Friday 8AM",
        "type": "Workforce",
        "date": (datetime.utcnow() + timedelta(days=2)).isoformat(),
        "linked": "/workforce/toolbox-001.txt"
    },
    {
        "id": "payapp-001",
        "title": "Payment App #1 Due",
        "type": "Payment",
        "date": (datetime.utcnow() + timedelta(days=20)).isoformat(),
        "linked": "/docs/payapp-001.pdf"
    }
]

@app.get("/api/calendar/events")
def get_calendar_events(projectId: str = "DEMO"):
    # Later: filter by projectId
    return {"ok": True, "events": CAL_EVENTS}

@app.post("/api/calendar/events")
def add_calendar_event(body: dict = Body(...)):
    ev = {
        "id": body.get("id", f"ev-{int(time.time())}"),
        "title": body.get("title"),
        "type": body.get("type", "General"),
        "date": body.get("date", datetime.utcnow().isoformat()),
        "linked": body.get("linked", None)
    }
    CAL_EVENTS.append(ev)
    return {"ok": True, "event": ev}
