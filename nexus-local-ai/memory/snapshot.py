#!/usr/bin/env python3
"""
Memory Snapshot Service - Periodically captures and stores conversation state
"""

import os
import json
import time
import logging
from datetime import datetime
from pathlib import Path

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
SNAPSHOT_DIR = os.path.join(ROOT_DIR, 'memory', 'snapshots')
ENV_FILE = os.path.join(ROOT_DIR, '.env')

# Create snapshot directory
Path(SNAPSHOT_DIR).mkdir(parents=True, exist_ok=True)

# Load environment variables
def load_env():
    env_vars = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env_vars[key] = value
    return env_vars

env = load_env()
SNAPSHOT_INTERVAL = int(env.get('MEMORY_SNAPSHOT_INTERVAL', 60))

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('nexus-memory')

class MemorySnapshot:
    """Manages memory snapshots"""
    
    def __init__(self, snapshot_dir: str):
        self.snapshot_dir = snapshot_dir
        self.conversation_history = []
        
    def add_message(self, role: str, content: str):
        """Add a message to conversation history"""
        self.conversation_history.append({
            'role': role,
            'content': content,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    def create_snapshot(self):
        """Create a snapshot of current state"""
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        filename = f"snapshot_{timestamp}.json"
        filepath = os.path.join(self.snapshot_dir, filename)
        
        snapshot = {
            'timestamp': datetime.utcnow().isoformat(),
            'conversation_history': self.conversation_history,
            'message_count': len(self.conversation_history)
        }
        
        with open(filepath, 'w') as f:
            json.dump(snapshot, f, indent=2)
        
        logger.info(f"Created snapshot: {filename} ({len(self.conversation_history)} messages)")
        
        # Keep only last 100 snapshots
        self.cleanup_old_snapshots(100)
        
    def cleanup_old_snapshots(self, keep_count: int):
        """Remove old snapshots, keeping only the most recent"""
        snapshots = sorted(Path(self.snapshot_dir).glob('snapshot_*.json'))
        
        if len(snapshots) > keep_count:
            for snapshot in snapshots[:-keep_count]:
                snapshot.unlink()
                logger.info(f"Removed old snapshot: {snapshot.name}")
    
    def get_latest_snapshot(self):
        """Get the most recent snapshot"""
        snapshots = sorted(Path(self.snapshot_dir).glob('snapshot_*.json'))
        
        if snapshots:
            with open(snapshots[-1]) as f:
                return json.load(f)
        
        return None

def run_snapshot_service():
    """Run the memory snapshot service"""
    logger.info("Starting Memory Snapshot Service")
    logger.info(f"Snapshot directory: {SNAPSHOT_DIR}")
    logger.info(f"Snapshot interval: {SNAPSHOT_INTERVAL} seconds")
    
    memory = MemorySnapshot(SNAPSHOT_DIR)
    
    # Add initial system message
    memory.add_message('system', 'NexusLocalAI memory service initialized')
    
    try:
        while True:
            memory.create_snapshot()
            time.sleep(SNAPSHOT_INTERVAL)
            
    except KeyboardInterrupt:
        logger.info("Snapshot service stopped")
        memory.create_snapshot()  # Final snapshot

if __name__ == '__main__':
    run_snapshot_service()
