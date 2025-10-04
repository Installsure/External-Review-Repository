# Nexus Bootstrap - Expected Output

This document shows what users will see when they run the bootstrap script.

## Running the Script

```powershell
PS> .\scripts\bootstrap-nexus.ps1
```

## Expected Console Output

```
🚀 Nexus + InstallSure Bootstrap Starting...
=============================================

📦 Configuration:
   Chat Model: qwen2.5-coder:7b
   Embed Model: nomic-embed-text

🔧 Step 1: Checking Ollama...
   ✅ Ollama already installed
   Starting Ollama service...
   Pulling models...
pulling manifest
pulling 8934d96d3f08... 100% ▕████████████████▏ 4.7 GB
pulling 2490e7468436... 100% ▕████████████████▏  109 B
pulling eb4ce6d81186... 100% ▕████████████████▏  11 KB
pulling 7f1cf8827567... 100% ▕████████████████▏  487 B
verifying sha256 digest
writing manifest
success
   ✅ Models ready

🔧 Step 2: Creating project structure...
   ✅ Directories created

🔧 Step 3: Creating system prompt...
   ✅ System prompt created

🔧 Step 4: Creating Python requirements...
   ✅ Requirements file created

🔧 Step 5: Creating sample library manifest...
   ✅ Library manifest created

🔧 Step 6: Creating FastAPI server...
   ✅ FastAPI server created

🔧 Step 7: Installing Python dependencies...
   ✅ Dependencies installed

🔧 Step 8: Starting FastAPI server...
   ✅ Server started on http://127.0.0.1:5323

🔧 Step 9: Running demo...
   Verifying LLM and KB...
   Running daily learning...
   Adding memory...
   Attempting library ingest...
   Running full demo...

=============================================
✅ NEXUS + INSTALLSURE BOOTSTRAP COMPLETE!
=============================================

📊 Configuration Summary:
   LLM Base:  http://localhost:11434/v1
   Model:     qwen2.5-coder:7b
   Embeds:    nomic-embed-text
   KB Size:   23
   Learn Add: 15
   Library:   skipped

📁 Output Files:
   Daily brief: nexus/data/daily_brief.md
   Demo receipt: nexus/data/demo_receipt.json

🔧 Cursor/Copilot OpenAI-compatible Configuration:
   Base URL: http://localhost:11434/v1
   API Key:  ollama
   Model:    qwen2.5-coder:7b

=============================================

📚 What to do next:

1. Edit sample-library.manifest.json with real URLs, then re-run:
   Invoke-RestMethod http://127.0.0.1:5323/library/ingest -Method POST

2. Add a lecture transcript to the KB:
   Invoke-RestMethod http://127.0.0.1:5323/youtube/add -Method POST `
     -ContentType "application/json" `
     -Body '{"url":"https://www.youtube.com/watch?v=YOUR_VIDEO"}'

3. Point Cursor (or VS Code + Copilot) to your local LLM:
   Provider: OpenAI-compatible
   Base URL: http://localhost:11434/v1
   API Key:  ollama
   Model:    qwen2.5-coder:7b

✨ Done! Server is running at http://127.0.0.1:5323
=============================================
```

## Files Created After Running

```
External-Review-Repository/
├── nexus/
│   ├── data/
│   │   ├── daily_brief.md         # Daily learning summary
│   │   └── demo_receipt.json      # Demo run results
│   ├── memory/
│   │   └── journal.jsonl          # Memory entries
│   ├── chroma/                    # Vector database files
│   ├── server.py                  # FastAPI application
│   └── requirements.txt           # Python dependencies
├── prompts/
│   └── nexus.system.txt           # AI system prompt
├── samples/                       # Empty, ready for samples
├── frontend/public/library/       # Empty, ready for docs
└── sample-library.manifest.json   # Library configuration
```

## Testing the API

### 1. Check Status
```powershell
PS> Invoke-RestMethod http://127.0.0.1:5323/verify

kb_size     : 23
llm_base    : http://localhost:11434/v1
model       : qwen2.5-coder:7b
embed_model : nomic-embed-text
```

### 2. View Daily Brief
```powershell
PS> Get-Content nexus/data/daily_brief.md

## HN
- Story 1: Title about AI advancement
- Story 2: New framework release
...

## arXiv
- Paper on neural networks
- Study on language models
...

## GitHub
- user/repo: Popular Python library for ML
- org/project: New web framework
...
```

### 3. Check Memory
```powershell
PS> Invoke-RestMethod http://127.0.0.1:5323/memory/dump

entries : 2
```

### 4. View Memory Journal
```powershell
PS> Get-Content nexus/memory/journal.jsonl

{"memory":"Tony prefers typed checklists and structured outputs.","tags":["tony","preference"]}
{"memory":"Remember: prefer unit-tested outputs, then code.","tags":["policy","tests-first"]}
```

## Success Indicators

✅ Ollama is running
✅ Models are downloaded
✅ Python dependencies installed
✅ FastAPI server started on port 5323
✅ Knowledge base initialized with 8+ entries
✅ Daily learning completed with 10+ new entries
✅ Memory system working
✅ All API endpoints responding
✅ Files generated correctly

## Next Steps

1. **Customize models**: Edit `$env:OLLAMA_MODEL_CHAT` before running
2. **Add documents**: Edit `sample-library.manifest.json` with real URLs
3. **Index YouTube**: Use `/youtube/add` endpoint with real video URLs
4. **Configure IDE**: Point Cursor/Copilot to local Ollama
5. **Daily use**: Server auto-learns at 7 AM daily
6. **Memory**: Add important facts via `/memory/add`

## Troubleshooting

If you see errors, check:
- Ollama is installed and running
- Python 3.10+ is available
- Port 5323 is not in use
- Internet connection for downloads
- Sufficient disk space for models (~8 GB)

For more help, see:
- documentation/NEXUS_AI_GUIDE.md
- documentation/NEXUS_QUICK_REFERENCE.md
