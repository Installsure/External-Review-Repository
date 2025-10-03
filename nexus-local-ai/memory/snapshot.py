#!/usr/bin/env python3
"""
NexusLocalAI Memory - Snapshot and persistence service
"""
import os
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List

# Configuration
MEMORY_DIR = Path(os.getenv("MEMORY_DIR", "./memory/snapshots"))
SNAPSHOT_INTERVAL = int(os.getenv("MEMORY_SNAPSHOT_INTERVAL", "60"))

class MemorySnapshot:
    """Memory snapshot manager"""
    
    def __init__(self):
        self.memory_dir = MEMORY_DIR
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        self.current_session = {
            "session_id": f"session_{int(time.time())}",
            "started_at": datetime.now().isoformat(),
            "interactions": [],
            "context": {}
        }
    
    def add_interaction(self, interaction: Dict[str, Any]):
        """Add an interaction to the current session"""
        interaction["timestamp"] = datetime.now().isoformat()
        self.current_session["interactions"].append(interaction)
    
    def update_context(self, key: str, value: Any):
        """Update session context"""
        self.current_session["context"][key] = value
    
    def take_snapshot(self):
        """Take a snapshot of current memory"""
        snapshot_file = self.memory_dir / f"snapshot_{int(time.time())}.json"
        
        snapshot = {
            "timestamp": datetime.now().isoformat(),
            "session": self.current_session,
            "stats": {
                "total_interactions": len(self.current_session["interactions"]),
                "context_keys": list(self.current_session["context"].keys())
            }
        }
        
        with open(snapshot_file, "w") as f:
            json.dump(snapshot, f, indent=2)
        
        print(f"📸 Snapshot saved: {snapshot_file}")
        return snapshot_file
    
    def get_recent_snapshots(self, count: int = 10) -> List[Path]:
        """Get the most recent snapshots"""
        snapshots = sorted(
            self.memory_dir.glob("snapshot_*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True
        )
        return snapshots[:count]
    
    def load_snapshot(self, snapshot_path: Path) -> Dict[str, Any]:
        """Load a snapshot from disk"""
        with open(snapshot_path, "r") as f:
            return json.load(f)

def run_memory_service():
    """Run the memory snapshot service"""
    print(f"🧠 Starting NexusLocalAI Memory Service")
    print(f"📁 Memory directory: {MEMORY_DIR}")
    print(f"⏱️  Snapshot interval: {SNAPSHOT_INTERVAL}s")
    
    snapshot_manager = MemorySnapshot()
    
    # Example: Add some test interactions
    snapshot_manager.add_interaction({
        "type": "query",
        "content": "Initial system startup"
    })
    snapshot_manager.update_context("service", "memory")
    snapshot_manager.update_context("version", "1.0.0")
    
    # Take initial snapshot
    snapshot_manager.take_snapshot()
    
    print(f"✅ Memory service initialized")
    print(f"📊 Session: {snapshot_manager.current_session['session_id']}")
    
    # Continuous snapshot loop
    try:
        while True:
            time.sleep(SNAPSHOT_INTERVAL)
            snapshot_manager.take_snapshot()
    except KeyboardInterrupt:
        print("\n⏹️  Memory service stopped")
        # Take final snapshot
        snapshot_manager.take_snapshot()

if __name__ == "__main__":
    run_memory_service()
