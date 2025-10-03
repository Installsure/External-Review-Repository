# NexusLocalAI

Local AI infrastructure with OpenAI-compatible API, memory snapshots, and avatar bridge.

## Components

- **Router** (`router/main.py`): OpenAI-compatible API router with guardrails
- **Memory** (`memory/snapshot.py`): Periodic conversation state snapshots
- **Avatar** (`avatar/bridge.py`): WebSocket server for avatar interactions
- **Guardrails** (`guardrails/config.yaml`): Content filtering and routing rules

## Quick Start

### Windows

```powershell
# Bootstrap all services
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap.ps1

# Run smoke tests
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-tests.ps1
```

### Linux/Mac

```bash
# Install dependencies
pip install flask requests pyyaml websockets

# Start router
python router/main.py &

# Start memory service
python memory/snapshot.py &

# Start avatar bridge
python avatar/bridge.py &

# Start Qdrant (optional, requires Docker)
docker-compose up -d
```

## Services

Once running, you'll have:

- **Router API**: http://localhost:8099/route
  - OpenAI-compatible: http://localhost:8099/v1/chat/completions
  - Health check: http://localhost:8099/health

- **Avatar Bridge**: ws://localhost:8765

- **Memory Snapshots**: `./memory/snapshots/`

- **Qdrant**: http://localhost:6333 (if Docker available)

## Configuration

Edit `.env` to customize:

```env
DEFAULT_MODEL=qwen2.5-coder:7b
ROUTER_PORT=8099
AVATAR_PORT=8765
MEMORY_SNAPSHOT_INTERVAL=60
```

Edit `guardrails/config.yaml` for content filters and routing rules.

## Usage Examples

### Test routing

```bash
curl -X POST http://localhost:8099/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a Python function"}'
```

### OpenAI-compatible API

```bash
curl -X POST http://localhost:8099/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-coder:7b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Requirements

- Python 3.8+
- Ollama (optional, for local model serving)
- Docker (optional, for Qdrant vector database)

## Models

Default models pulled during bootstrap:
- `qwen2.5-coder:7b` - Code generation and debugging
- `deepseek-coder-v2:16b` - Code analysis and explanations
- `qwen2.5:7b` - General purpose lightweight model

## Relocation

To move this setup to `C:\NexusLocalAI\`:

```powershell
# Copy entire directory
Copy-Item -Recurse .\nexus-local-ai C:\NexusLocalAI

# Update paths in bootstrap.ps1 if needed
# (The script already uses relative paths)
```

## Troubleshooting

### Router not starting
- Check Python is installed: `python --version`
- Install dependencies: `pip install flask requests pyyaml`

### Ollama models not available
- Ensure Ollama is installed: https://ollama.ai/download
- Pull models manually: `ollama pull qwen2.5-coder:7b`

### Qdrant not starting
- Ensure Docker is installed and running
- Check ports 6333/6334 are available
