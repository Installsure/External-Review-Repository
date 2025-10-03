# NexusLocalAI

Local AI infrastructure for the External Review Repository.

## Overview

NexusLocalAI provides a complete local AI stack with:
- **Router**: FastAPI-based routing service for AI model requests
- **Memory**: Snapshot-based persistence for conversations and context
- **Avatar**: WebSocket bridge for real-time communication
- **Guardrails**: Safety and rate limiting configuration

## Quick Start

### Prerequisites
- Python 3.8+
- PowerShell (Windows) or Bash (Linux/Mac)
- Docker (optional, for Qdrant)

### Bootstrap

Run the bootstrap script to set up everything:

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File .\nexus-local-ai\scripts\bootstrap.ps1

# Or with options:
powershell -ExecutionPolicy Bypass -File .\nexus-local-ai\scripts\bootstrap.ps1 -SkipDocker
```

This will:
1. Create necessary directories
2. Install Python dependencies
3. Install/start Ollama
4. Pull AI models (Qwen-Coder, DeepSeek, Qwen2.5)
5. Start Qdrant (if Docker is available)
6. Start Router, Memory, and Avatar services

### Verify Installation

Run smoke tests:

```powershell
powershell -ExecutionPolicy Bypass -File .\nexus-local-ai\scripts\smoke-tests.ps1
```

## Services

### Router (http://localhost:8099)
Routes AI requests to appropriate models with guardrails.

**Endpoints:**
- `GET /` - Service info
- `GET /health` - Health check
- `POST /route` - Route a request

**Example:**
```bash
curl -X POST http://localhost:8099/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a hello world in Python", "max_tokens": 100}'
```

### Avatar Bridge (ws://localhost:8765)
WebSocket server for real-time communication.

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:8765');
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```

### Memory Service
Automatic snapshots every 60 seconds to `./memory/snapshots/`

### Qdrant (http://localhost:6333)
Vector database for semantic search (requires Docker).

## Configuration

Edit `.env` to customize:
```env
OLLAMA_BASE_URL=http://localhost:11434
PRIMARY_MODEL=qwen-coder
ROUTER_PORT=8099
MEMORY_SNAPSHOT_INTERVAL=60
```

## Guardrails

Edit `guardrails/config.yaml` to configure:
- Rate limits
- Content filtering
- Model constraints
- Safety checks

## Directory Structure

```
nexus-local-ai/
├── .env                      # Environment configuration
├── docker-compose.yml        # Docker services
├── guardrails/
│   └── config.yaml          # Guardrails configuration
├── router/
│   └── main.py              # Router service
├── memory/
│   ├── snapshot.py          # Memory snapshot service
│   └── snapshots/           # Snapshot storage
├── avatar/
│   └── bridge.py            # WebSocket bridge
└── scripts/
    ├── bootstrap.ps1        # Setup script
    └── smoke-tests.ps1      # Test script
```

## Stopping Services

To stop all services:

```powershell
# Find and stop Python processes
Get-Process python | Where-Object { $_.Path -like "*nexus-local-ai*" } | Stop-Process

# Stop Docker services
docker-compose down
```

## Troubleshooting

**Router not responding:**
- Check if Ollama is running: `ollama list`
- Verify models are pulled: `ollama list`

**Memory service not creating snapshots:**
- Check write permissions on `./memory/snapshots/`
- Verify the service is running

**Avatar WebSocket connection fails:**
- Check if port 8765 is available
- Verify firewall settings

## Development

To run services in development mode with auto-reload:

```bash
# Router
cd router
uvicorn main:app --reload --host 0.0.0.0 --port 8099

# Avatar
cd avatar
python bridge.py

# Memory
cd memory
python snapshot.py
```
