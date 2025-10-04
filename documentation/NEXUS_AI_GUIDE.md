# 🤖 Nexus AI System Guide

## Overview

Nexus is an AI-powered learning and memory system integrated with InstallSure. It provides:
- **Automated Learning**: Daily harvesting from HN, arXiv, and GitHub
- **Persistent Memory**: Jarvis-style memory system with tagging
- **YouTube Integration**: Video transcript extraction and indexing
- **Library Management**: Document ingestion for knowledge base building
- **Local LLM**: Runs entirely on your machine via Ollama

## Prerequisites

### Required Software
- **Windows 10/11** (PowerShell 5.1+)
- **Python 3.10+** with pip
- **Ollama** (will be auto-installed if winget/choco available)

### Optional Software
- **winget** or **choco** (for automatic Ollama installation)

## Quick Start

### 1. Run the Bootstrap Script

```powershell
.\scripts\bootstrap-nexus.ps1
```

The script will automatically:
1. ✅ Install/start Ollama with required models
2. ✅ Create project directory structure
3. ✅ Generate system prompts
4. ✅ Create Python requirements
5. ✅ Install dependencies
6. ✅ Start FastAPI server
7. ✅ Run demo to verify functionality

### 2. Verify Installation

After the script completes, you should see:

```
============================================
✅ NEXUS + INSTALLSURE BOOTSTRAP COMPLETE!
============================================

📊 Configuration Summary:
   LLM Base:  http://localhost:11434/v1
   Model:     qwen2.5-coder:7b
   Embeds:    nomic-embed-text
   KB Size:   8
   Learn Add: 15
   Library:   skipped

📁 Output Files:
   Daily brief: nexus/data/daily_brief.md
   Demo receipt: nexus/data/demo_receipt.json
```

## Architecture

### Directory Structure

```
External-Review-Repository/
├── nexus/
│   ├── data/              # Output files (daily briefs, receipts)
│   ├── memory/            # Memory journal files
│   ├── chroma/            # Vector database storage
│   ├── scripts/           # Utility scripts
│   ├── server.py          # FastAPI application
│   └── requirements.txt   # Python dependencies
├── prompts/
│   └── nexus.system.txt   # System prompt for AI
├── samples/               # Sample documents
├── frontend/public/library/  # Ingested document library
└── sample-library.manifest.json  # Library configuration
```

### Components

#### 1. FastAPI Server (`nexus/server.py`)

The core API server that provides:
- Knowledge base management via ChromaDB
- LLM integration via Ollama
- Scheduled learning tasks
- Memory persistence

**Port**: 5323  
**Base URL**: http://127.0.0.1:5323

#### 2. Knowledge Base (ChromaDB)

Vector database for semantic search:
- Curriculum seeds (OSSU, CS50, Odin Project)
- Construction standards (AIA, RFI, Safety)
- Daily learning harvests
- YouTube transcripts
- Library documents

#### 3. Memory System

JSON Lines format memory journal:
- User preferences
- Important facts
- Tag-based organization
- Automatic snapshots every 10 minutes

## API Reference

### GET `/verify`

Check system status and configuration.

**Response:**
```json
{
  "kb_size": 8,
  "llm_base": "http://localhost:11434/v1",
  "model": "qwen2.5-coder:7b",
  "embed_model": "nomic-embed-text"
}
```

### POST `/learn/daily`

Trigger daily learning harvest from HN, arXiv, and GitHub.

**Response:**
```json
{
  "added": 15
}
```

**Side Effects:**
- Creates `nexus/data/daily_brief.md` with summaries
- Adds entries to knowledge base

### POST `/memory/add`

Add a new memory entry.

**Request Body:**
```json
{
  "memory": "Tony prefers structured outputs",
  "tags": ["tony", "preference"]
}
```

**Response:**
```json
{
  "ok": true
}
```

### GET `/memory/dump`

Get count of memory entries.

**Response:**
```json
{
  "entries": 42
}
```

### POST `/youtube/add`

Extract and index a YouTube video transcript.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "ok": true,
  "chars": 12453
}
```

### POST `/library/ingest`

Ingest documents from the library manifest.

**Response:**
```json
{
  "ok": true,
  "ingested": 6,
  "report": [
    {
      "title": "Plan A1.1 – Sample Floor Plan",
      "saved": "/library/plan_a1_1_sample_floor_plan.pdf"
    }
  ]
}
```

### POST `/demo/installsure`

Run full demo workflow.

**Response:**
```json
{
  "ok": true,
  "kb_size": 23,
  "learn_added": 15,
  "library": {
    "ok": true,
    "ingested": 6
  }
}
```

## Configuration

### Environment Variables

- `OLLAMA_MODEL_CHAT` - Chat model (default: `qwen2.5-coder:7b`)
- `OLLAMA_MODEL_EMBED` - Embedding model (default: `nomic-embed-text`)
- `OPENAI_API_BASE` - LLM API base URL (set automatically)
- `OPENAI_API_KEY` - API key (set to `ollama`)
- `INSTALLSURE_LLM_MODEL` - Model for InstallSure (set automatically)
- `INSTALLSURE_EMBED_MODEL` - Embed model (set automatically)

### Custom Models

To use different Ollama models:

```powershell
$env:OLLAMA_MODEL_CHAT = "llama3.2:latest"
$env:OLLAMA_MODEL_EMBED = "nomic-embed-text"
.\scripts\bootstrap-nexus.ps1
```

## IDE Integration

### Cursor / VS Code + Copilot

Configure your IDE to use the local LLM:

1. Open Settings
2. Find OpenAI-compatible provider settings
3. Configure:
   - **Provider**: OpenAI-compatible
   - **Base URL**: `http://localhost:11434/v1`
   - **API Key**: `ollama`
   - **Model**: `qwen2.5-coder:7b`

## Usage Examples

### Example 1: Daily Learning

```powershell
# Trigger daily learning
Invoke-RestMethod http://127.0.0.1:5323/learn/daily -Method POST

# Check the results
Get-Content nexus/data/daily_brief.md
```

### Example 2: Add Memory

```powershell
$memory = @{
    memory = "User prefers React over Vue"
    tags = @("preference", "frontend")
} | ConvertTo-Json

Invoke-RestMethod http://127.0.0.1:5323/memory/add `
    -Method POST `
    -ContentType "application/json" `
    -Body $memory
```

### Example 3: YouTube Transcript

```powershell
$youtube = @{
    url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
} | ConvertTo-Json

Invoke-RestMethod http://127.0.0.1:5323/youtube/add `
    -Method POST `
    -ContentType "application/json" `
    -Body $youtube
```

### Example 4: Library Ingest

First, edit `sample-library.manifest.json` with real URLs:

```json
{
  "projectId": "MY_PROJECT",
  "items": [
    {
      "docType": "Blueprint",
      "title": "Floor Plan Level 1",
      "category": "Drawings",
      "url": "https://example.com/floor-plan-l1.pdf"
    }
  ]
}
```

Then run:

```powershell
Invoke-RestMethod http://127.0.0.1:5323/library/ingest -Method POST
```

## Scheduled Tasks

The system automatically runs:

1. **Daily Learning**: 7:00 AM daily
   - Harvests from HN, arXiv, GitHub
   - Summarizes and indexes content
   - Updates `daily_brief.md`

2. **Memory Snapshots**: Every 10 minutes
   - Creates automatic checkpoint
   - Persists to `nexus/memory/journal.jsonl`

## Troubleshooting

### Issue: Ollama not found

**Solution**: Install Ollama manually:
1. Download from https://ollama.com/download
2. Install and run
3. Re-run the bootstrap script

### Issue: Python not found

**Solution**: Install Python 3.10+:
1. Download from https://python.org
2. Ensure it's in PATH
3. Re-run the bootstrap script

### Issue: Server won't start

**Solution**: Check port 5323 is available:
```powershell
netstat -ano | findstr :5323
```

If occupied, stop the process or change the port in the script.

### Issue: Daily learning times out

**Solution**: This is normal for first run. The system needs time to:
- Download models
- Process content
- Generate summaries

Be patient or check logs in the server window.

### Issue: Library ingest fails

**Solution**: Check that:
1. `sample-library.manifest.json` exists
2. URLs are accessible
3. Network connection is available
4. `frontend/public/library/` directory exists

## Advanced Topics

### Custom System Prompt

Edit `prompts/nexus.system.txt` to customize AI behavior:

```
You are Nexus, powering InstallSure.
FOCUS:
- Your custom instructions here
RULES:
- Your custom rules here
MEMORY:
- Your memory policy here
```

Restart the server to apply changes.

### Database Backup

ChromaDB data is in `nexus/chroma/`. To backup:

```powershell
Copy-Item -Recurse nexus/chroma nexus/chroma.backup
```

To restore:

```powershell
Remove-Item -Recurse nexus/chroma
Copy-Item -Recurse nexus/chroma.backup nexus/chroma
```

### Memory Export

Export all memories:

```powershell
Get-Content nexus/memory/journal.jsonl | ConvertFrom-Json
```

### API Testing

Test API with PowerShell:

```powershell
# Get status
Invoke-RestMethod http://127.0.0.1:5323/verify

# Run demo
Invoke-RestMethod http://127.0.0.1:5323/demo/installsure -Method POST
```

## Security Considerations

1. **Local Only**: The system runs entirely on localhost
2. **No External API Keys**: Uses local Ollama (no OpenAI/etc)
3. **Data Privacy**: All data stays on your machine
4. **Network Access**: Only for learning harvests (HN, arXiv, GitHub)

## Performance Tips

1. **Model Size**: Smaller models = faster responses
   - Try `qwen2.5-coder:3b` for speed
   - Use `qwen2.5-coder:14b` for quality

2. **Memory**: Large knowledge bases need more RAM
   - Monitor with Task Manager
   - Clean up old entries periodically

3. **Disk Space**: ChromaDB and models use storage
   - Models: ~4-8 GB each
   - ChromaDB: Grows with content

## Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Open GitHub issue
4. Check Ollama documentation: https://ollama.com/docs

## License

See main repository LICENSE file.

---

**Last Updated**: 2025-01-10  
**Version**: 1.0.0
