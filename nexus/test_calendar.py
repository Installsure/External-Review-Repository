"""
Simple test script for the calendar API endpoints.
Run the server first with: uvicorn server:app --port 8000
Then run this script: python test_calendar.py
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000"

def test_get_events():
    """Test GET /api/calendar/events"""
    print("\n=== Testing GET /api/calendar/events ===")
    response = requests.get(f"{BASE_URL}/api/calendar/events")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert response.json()["ok"] == True
    assert len(response.json()["events"]) >= 4  # Initial events
    print("✓ GET test passed")

def test_get_events_with_project():
    """Test GET /api/calendar/events with projectId"""
    print("\n=== Testing GET /api/calendar/events?projectId=TEST ===")
    response = requests.get(f"{BASE_URL}/api/calendar/events?projectId=TEST")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    print("✓ GET with projectId test passed")

def test_post_event():
    """Test POST /api/calendar/events"""
    print("\n=== Testing POST /api/calendar/events ===")
    new_event = {
        "title": "Test Event from Script",
        "type": "Meeting",
        "date": (datetime.utcnow() + timedelta(days=3)).isoformat(),
        "linked": "/test/event.pdf"
    }
    response = requests.post(
        f"{BASE_URL}/api/calendar/events",
        json=new_event
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert response.json()["ok"] == True
    assert response.json()["event"]["title"] == new_event["title"]
    print("✓ POST test passed")

def test_post_event_with_custom_id():
    """Test POST /api/calendar/events with custom ID"""
    print("\n=== Testing POST /api/calendar/events with custom ID ===")
    new_event = {
        "id": f"test-{int(datetime.utcnow().timestamp())}",
        "title": "Custom ID Event",
        "type": "General"
    }
    response = requests.post(
        f"{BASE_URL}/api/calendar/events",
        json=new_event
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert response.json()["event"]["id"] == new_event["id"]
    print("✓ POST with custom ID test passed")

if __name__ == "__main__":
    try:
        print("Starting Calendar API Tests...")
        test_get_events()
        test_get_events_with_project()
        test_post_event()
        test_post_event_with_custom_id()
        print("\n" + "="*50)
        print("All tests passed! ✓")
        print("="*50)
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the server.")
        print("Make sure the server is running: uvicorn server:app --port 8000")
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
