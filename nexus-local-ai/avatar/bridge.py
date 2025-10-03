#!/usr/bin/env python3
"""
Avatar Bridge - WebSocket server for avatar interactions
"""

import os
import json
import asyncio
import logging
from datetime import datetime

try:
    import websockets
except ImportError:
    print("Installing websockets...")
    os.system("pip install websockets")
    import websockets

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(ROOT_DIR, '.env')

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
AVATAR_PORT = int(env.get('AVATAR_PORT', 8765))

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('nexus-avatar')

# Connected clients
connected_clients = set()

async def handle_client(websocket, path):
    """Handle WebSocket client connection"""
    logger.info(f"Client connected from {websocket.remote_address}")
    connected_clients.add(websocket)
    
    try:
        # Send welcome message
        await websocket.send(json.dumps({
            'type': 'welcome',
            'message': 'Connected to NexusLocalAI Avatar Bridge',
            'timestamp': datetime.utcnow().isoformat()
        }))
        
        async for message in websocket:
            try:
                data = json.loads(message)
                logger.info(f"Received message: {data.get('type', 'unknown')}")
                
                # Echo back with processing indicator
                response = {
                    'type': 'response',
                    'original': data,
                    'processed': True,
                    'timestamp': datetime.utcnow().isoformat()
                }
                
                await websocket.send(json.dumps(response))
                
                # Broadcast to other clients
                if len(connected_clients) > 1:
                    broadcast_message = {
                        'type': 'broadcast',
                        'data': data,
                        'timestamp': datetime.utcnow().isoformat()
                    }
                    await asyncio.gather(
                        *[client.send(json.dumps(broadcast_message)) 
                          for client in connected_clients if client != websocket],
                        return_exceptions=True
                    )
                    
            except json.JSONDecodeError:
                logger.error("Invalid JSON received")
                await websocket.send(json.dumps({
                    'type': 'error',
                    'message': 'Invalid JSON format'
                }))
                
    except websockets.exceptions.ConnectionClosed:
        logger.info("Client disconnected")
    finally:
        connected_clients.remove(websocket)

async def main():
    """Start the WebSocket server"""
    logger.info(f"Starting Avatar Bridge on ws://localhost:{AVATAR_PORT}")
    
    async with websockets.serve(handle_client, "0.0.0.0", AVATAR_PORT):
        logger.info(f"Avatar Bridge ready - {len(connected_clients)} clients connected")
        await asyncio.Future()  # Run forever

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Avatar Bridge stopped")
