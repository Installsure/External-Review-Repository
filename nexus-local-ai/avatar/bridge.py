#!/usr/bin/env python3
"""
NexusLocalAI Avatar - WebSocket bridge for real-time communication
"""
import os
import asyncio
import json
from datetime import datetime
from typing import Set
import websockets
from websockets.server import WebSocketServerProtocol

# Configuration
AVATAR_PORT = int(os.getenv("AVATAR_PORT", "8765"))
AVATAR_HOST = os.getenv("AVATAR_HOST", "0.0.0.0")

class AvatarBridge:
    """WebSocket bridge for avatar communication"""
    
    def __init__(self):
        self.connections: Set[WebSocketServerProtocol] = set()
        self.message_history = []
    
    async def register(self, websocket: WebSocketServerProtocol):
        """Register a new connection"""
        self.connections.add(websocket)
        print(f"🔗 Client connected: {websocket.remote_address}")
        print(f"👥 Active connections: {len(self.connections)}")
        
        # Send welcome message
        await websocket.send(json.dumps({
            "type": "welcome",
            "timestamp": datetime.now().isoformat(),
            "message": "Connected to NexusLocalAI Avatar Bridge"
        }))
    
    async def unregister(self, websocket: WebSocketServerProtocol):
        """Unregister a connection"""
        self.connections.discard(websocket)
        print(f"❌ Client disconnected: {websocket.remote_address}")
        print(f"👥 Active connections: {len(self.connections)}")
    
    async def broadcast(self, message: dict):
        """Broadcast a message to all connected clients"""
        if not self.connections:
            return
        
        message_json = json.dumps(message)
        await asyncio.gather(
            *[conn.send(message_json) for conn in self.connections],
            return_exceptions=True
        )
    
    async def handle_message(self, websocket: WebSocketServerProtocol, message: str):
        """Handle incoming message from client"""
        try:
            data = json.loads(message)
            print(f"📨 Received: {data.get('type', 'unknown')}")
            
            # Store in history
            self.message_history.append({
                "timestamp": datetime.now().isoformat(),
                "from": str(websocket.remote_address),
                "data": data
            })
            
            # Echo back with timestamp
            response = {
                "type": "response",
                "timestamp": datetime.now().isoformat(),
                "original_message": data,
                "status": "received"
            }
            await websocket.send(json.dumps(response))
            
            # Optionally broadcast to other clients
            if data.get("broadcast"):
                await self.broadcast({
                    "type": "broadcast",
                    "timestamp": datetime.now().isoformat(),
                    "message": data
                })
                
        except json.JSONDecodeError:
            await websocket.send(json.dumps({
                "type": "error",
                "message": "Invalid JSON"
            }))
    
    async def connection_handler(self, websocket: WebSocketServerProtocol):
        """Handle a WebSocket connection"""
        await self.register(websocket)
        try:
            async for message in websocket:
                await self.handle_message(websocket, message)
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            await self.unregister(websocket)

async def main():
    """Main entry point for avatar bridge"""
    print(f"🎭 Starting NexusLocalAI Avatar Bridge")
    print(f"🌐 WebSocket server: ws://{AVATAR_HOST}:{AVATAR_PORT}")
    
    bridge = AvatarBridge()
    
    async with websockets.serve(bridge.connection_handler, AVATAR_HOST, AVATAR_PORT):
        print(f"✅ Avatar bridge running")
        print(f"💡 Connect clients to: ws://{AVATAR_HOST}:{AVATAR_PORT}")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⏹️  Avatar bridge stopped")
