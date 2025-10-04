# 🚀 Nexus Quick Reference

## One-Line Start

```powershell
.\scripts\bootstrap-nexus.ps1
```

## Common Commands

### Check Status
```powershell
Invoke-RestMethod http://127.0.0.1:5323/verify
```

### Daily Learning
```powershell
Invoke-RestMethod http://127.0.0.1:5323/learn/daily -Method POST
```

### Add Memory
```powershell
Invoke-RestMethod http://127.0.0.1:5323/memory/add -Method POST `
  -ContentType "application/json" `
  -Body '{"memory":"Your note here","tags":["tag1","tag2"]}'
```

### Add YouTube Video
```powershell
Invoke-RestMethod http://127.0.0.1:5323/youtube/add -Method POST `
  -ContentType "application/json" `
  -Body '{"url":"https://www.youtube.com/watch?v=VIDEO_ID"}'
```

### Ingest Library
```powershell
Invoke-RestMethod http://127.0.0.1:5323/library/ingest -Method POST
```

### Run Full Demo
```powershell
Invoke-RestMethod http://127.0.0.1:5323/demo/installsure -Method POST
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/verify` | Check system status |
| POST | `/learn/daily` | Trigger daily learning |
| POST | `/memory/add` | Add memory entry |
| GET | `/memory/dump` | List memory count |
| POST | `/youtube/add` | Index YouTube video |
| POST | `/library/ingest` | Ingest documents |
| POST | `/demo/installsure` | Run full demo |

## IDE Configuration

### Cursor / VS Code + Copilot

- **Provider**: OpenAI-compatible
- **Base URL**: `http://localhost:11434/v1`
- **API Key**: `ollama`
- **Model**: `qwen2.5-coder:7b`

## Environment Variables

```powershell
# Custom chat model
$env:OLLAMA_MODEL_CHAT = "llama3.2:latest"

# Custom embedding model
$env:OLLAMA_MODEL_EMBED = "nomic-embed-text"
```

## File Locations

| Path | Purpose |
|------|---------|
| `nexus/data/daily_brief.md` | Daily learning summary |
| `nexus/data/demo_receipt.json` | Demo results |
| `nexus/memory/journal.jsonl` | Memory entries |
| `nexus/chroma/` | Vector database |
| `prompts/nexus.system.txt` | System prompt |
| `sample-library.manifest.json` | Library config |

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Ollama not found | Install from https://ollama.com/download |
| Python not found | Install Python 3.10+ |
| Port 5323 busy | `netstat -ano \| findstr :5323` |
| Learning timeout | Normal on first run, be patient |
| Library ingest fails | Check URLs in manifest |

## Server Control

### Start Server
```powershell
cd nexus
python -m uvicorn server:app --host 127.0.0.1 --port 5323
```

### Stop Server
- Find process: `Get-Process python`
- Stop it: `Stop-Process -Name python`

## Backup & Restore

### Backup
```powershell
Copy-Item -Recurse nexus/chroma nexus/chroma.backup
Copy-Item nexus/memory/journal.jsonl nexus/memory/journal.jsonl.backup
```

### Restore
```powershell
Copy-Item -Recurse nexus/chroma.backup nexus/chroma
Copy-Item nexus/memory/journal.jsonl.backup nexus/memory/journal.jsonl
```

## Performance Tips

- **Speed**: Use `qwen2.5-coder:3b`
- **Quality**: Use `qwen2.5-coder:14b`
- **Balance**: Use `qwen2.5-coder:7b` (default)

---

📚 Full documentation: [NEXUS_AI_GUIDE.md](NEXUS_AI_GUIDE.md)
