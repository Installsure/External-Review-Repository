# === NEXUS + INSTALLSURE: FULL BOOTSTRAP & DEMO ===
# One-Paste, End-to-End Bootstrap + Demo
# Last Updated: 2025-01-10

$ErrorActionPreference = 'Stop'

Write-Host "🚀 Nexus + InstallSure Bootstrap Starting..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

function Have($n){ return [bool](Get-Command $n -ErrorAction SilentlyContinue) }
function Mk($p){ if(-not (Test-Path $p)){ New-Item -ItemType Directory -Path $p | Out-Null } }
function W($p,$c){ $d=Split-Path -Parent $p; if(-not(Test-Path $d)){ Mk $d }; Set-Content -Path $p -Value $c -Encoding UTF8 -Force }

# === 0) MODELS (change if you like) ===
$CHAT_MODEL  = $env:OLLAMA_MODEL_CHAT ; if([string]::IsNullOrWhiteSpace($CHAT_MODEL)){  $CHAT_MODEL  = "qwen2.5-coder:7b" }
$EMB_MODEL   = $env:OLLAMA_MODEL_EMBED; if([string]::IsNullOrWhiteSpace($EMB_MODEL)){   $EMB_MODEL   = "nomic-embed-text" }

Write-Host "`n📦 Configuration:" -ForegroundColor Yellow
Write-Host "   Chat Model: $CHAT_MODEL" -ForegroundColor Gray
Write-Host "   Embed Model: $EMB_MODEL" -ForegroundColor Gray

# === 1) OLLAMA INSTALL/START ===
Write-Host "`n🔧 Step 1: Checking Ollama..." -ForegroundColor Yellow
if (-not (Have "ollama")) {
  Write-Host "   Installing Ollama..." -ForegroundColor Gray
  if (Have "winget") { winget install -e --id Ollama.Ollama --accept-source-agreements --accept-package-agreements }
  elseif (Have "choco") { choco install ollama -y }
  else { Write-Host "Please install Ollama: https://ollama.com/download" ; throw "Ollama not found" }
} else {
  Write-Host "   ✅ Ollama already installed" -ForegroundColor Green
}

Write-Host "   Starting Ollama service..." -ForegroundColor Gray
try { Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden } catch {}
Start-Sleep 2

Write-Host "   Pulling models..." -ForegroundColor Gray
& ollama pull $CHAT_MODEL
& ollama pull $EMB_MODEL
Write-Host "   ✅ Models ready" -ForegroundColor Green

# === 2) PROJECT LAYOUT ===
Write-Host "`n🔧 Step 2: Creating project structure..." -ForegroundColor Yellow
Mk "nexus"; Mk "nexus/data"; Mk "nexus/memory"; Mk "nexus/chroma"; Mk "nexus/scripts"; Mk "prompts"; Mk "samples"; Mk "frontend/public/library"
Write-Host "   ✅ Directories created" -ForegroundColor Green

# === 3) SYSTEM PROMPT ===
Write-Host "`n🔧 Step 3: Creating system prompt..." -ForegroundColor Yellow
W "prompts/nexus.system.txt" @'
You are Nexus, powering InstallSure.
FOCUS:
- Blueprint intake, tagging, QTO, assembly-code mapping, RFI/CO drafts, workforce & safety docs.
- Code mastery: tests first, then implementation, then run-fix plan.
- Learn daily from reputable curricula and news; cite sources on request.
RULES:
- Never invent costs/specs; explicitly list assumptions + missing data.
- Prefer structured outputs:
  { "context_used":[], "assumptions":[], "plan":[], "qto_lines":[], "draft_docs":[], "next_steps":[] }
MEMORY:
- On "remember this", emit compact fact + tags. Keep it short. No sensitive PII unless user gave it.
'@
Write-Host "   ✅ System prompt created" -ForegroundColor Green

# === 4) PYTHON REQUIREMENTS ===
Write-Host "`n🔧 Step 4: Creating Python requirements..." -ForegroundColor Yellow
W "nexus/requirements.txt" @"
fastapi==0.115.4
uvicorn==0.30.6
requests==2.32.3
chromadb==0.5.5
sentence-transformers==3.0.1
apscheduler==3.10.4
pydantic==2.9.2
duckdb==1.1.3
yt-dlp==2025.01.10
feedparser==6.0.11
pytest==8.3.3
youtube-transcript-api==0.6.2
"@
Write-Host "   ✅ Requirements file created" -ForegroundColor Green

# === 5) OPTIONAL: SAMPLE LIBRARY MANIFEST (EDIT URLs LATER) ===
Write-Host "`n🔧 Step 5: Creating sample library manifest..." -ForegroundColor Yellow
W "sample-library.manifest.json" @'
{
  "projectId": "DEMO",
  "items": [
    {
      "docType": "Blueprint",
      "title": "Plan A1.1 – Sample Floor Plan",
      "category": "Drawings",
      "url": "https://example.com/planA1_1.pdf"
    },
    {
      "docType": "RFI",
      "title": "RFI-001 – Clarify wall assembly at grid B",
      "category": "Contract Admin",
      "url": "https://example.com/rfi-template.pdf"
    },
    {
      "docType": "ChangeOrder",
      "title": "AIA G701 – Change Order",
      "category": "Change Orders",
      "url": "https://example.com/aia-g701-sample.pdf"
    },
    {
      "docType": "PaymentApp",
      "title": "AIA G702 – Application for Payment",
      "category": "Payment",
      "url": "https://example.com/aia-g702-sample.pdf"
    },
    {
      "docType": "LienWaiver",
      "title": "Conditional Waiver – Progress Payment",
      "category": "Liens",
      "url": "https://example.com/lien-waiver-conditional-progress.pdf"
    },
    {
      "docType": "Workforce",
      "title": "Safety Orientation Checklist",
      "category": "Workforce",
      "url": "https://example.com/safety-orientation-checklist.pdf"
    }
  ]
}
'@
Write-Host "   ✅ Library manifest created" -ForegroundColor Green

# === 6) FASTAPI SERVER (learning, memory, YouTube, library ingest, demo) ===
Write-Host "`n🔧 Step 6: Creating FastAPI server..." -ForegroundColor Yellow
W "nexus/server.py" @"
import os, json, time, datetime, pathlib, requests, feedparser, re
from fastapi import FastAPI, Body
from apscheduler.schedulers.background import BackgroundScheduler
import chromadb

BASE_URL=os.environ.get('OPENAI_API_BASE','http://localhost:11434/v1')
MODEL=os.environ.get('INSTALLSURE_LLM_MODEL','${CHAT_MODEL}')
EMB=os.environ.get('INSTALLSURE_EMBED_MODEL','${EMB_MODEL}')

DATA_DIR=pathlib.Path('nexus/data'); DATA_DIR.mkdir(parents=True,exist_ok=True)
MEM_DIR=pathlib.Path('nexus/memory'); MEM_DIR.mkdir(parents=True,exist_ok=True)
CHROMA_DIR=pathlib.Path('nexus/chroma'); CHROMA_DIR.mkdir(parents=True,exist_ok=True)
PUB_LIB=pathlib.Path('frontend/public/library'); PUB_LIB.mkdir(parents=True,exist_ok=True)

client=chromadb.PersistentClient(path=str(CHROMA_DIR))
kb=client.get_or_create_collection('nexus_kb')

app=FastAPI(title='Nexus+InstallSure')

def _embed(txts):
    embs=[]
    for t in txts:
        r=requests.post('http://localhost:11434/api/embeddings', json={'model':EMB,'prompt':t})
        embs.append(r.json()['embedding'])
    return embs

def _add_docs(items):
    ids=[f'doc-{int(time.time()*1000)}-{i}' for i,_ in enumerate(items)]
    kb.add(ids=ids, documents=[it['text'] for it in items],
           metadatas=[{'source':it.get('source','seed')} for it in items],
           embeddings=_embed([it['text'] for it in items]))

def seed_curriculum_and_construction():
    seeds=[
      {'source':'OSSU','text':'OSSU CS: Intro CS, Math, Systems, Theory, Apps, Advanced, Capstone'},
      {'source':'CS50','text':'Harvard CS50: Scratch, C, Arrays, Algorithms, DS, Python, SQL, Web, Final'},
      {'source':'Odin','text':'Odin: Foundations (Git, HTML, CSS, JS), Full Stack JS (Node, DB, APIs, React, Deploy)'},
      {'source':'AIA','text':'AIA G701 Change Order: scope change, sum/time adjustments, authorization'},
      {'source':'AIA','text':'AIA G702 Application for Payment: work completed, retainage, certification'},
      {'source':'Lien','text':'Lien Waiver (Conditional/Unconditional): release upon payment, project/party refs'},
      {'source':'RFI','text':'RFI: question, referenced drawing/spec, proposed answer, due date'},
      {'source':'Safety','text':'Safety Checklist: PPE, fall protection, hazard comms, toolbox talks'}
    ]
    _add_docs(seeds)

def _summarize(title, text):
    sys=open('prompts/nexus.system.txt','r',encoding='utf-8').read()
    prompt=f'Summarize for Nexus KB (<=12 bullets). TITLE: {title}\nTEXT:\n{text[:1200]}'
    r=requests.post(f'{BASE_URL}/chat/completions',
        headers={'Authorization':'Bearer ollama'},
        json={'model':MODEL,'messages':[{'role':'system','content':sys},{'role':'user','content':prompt}]})
    return r.json()['choices'][0]['message']['content']

def harvest_daily():
    items=[]
    # HN
    try:
        ids=requests.get('https://hacker-news.firebaseio.com/v0/topstories.json').json()[:10]
        for i in ids:
            st=requests.get(f'https://hacker-news.firebaseio.com/v0/item/{i}.json').json()
            if st and st.get('title'): items.append({'source':'HN','text':st['title']})
    except: pass
    # arXiv
    try:
        feed=feedparser.parse('http://export.arxiv.org/api/query?search_query=cat:cs.CL&max_results=5')
        for e in feed.entries:
            items.append({'source':'arXiv','text':e.title+' '+e.summary[:600]})
    except: pass
    # GitHub trending-ish
    try:
        res=requests.get('https://api.github.com/search/repositories?q=language:Python+stars:%3E500&sort=stars&order=desc&per_page=5').json()
        for r in res.get('items',[]): items.append({'source':'GitHub','text':f"{r['full_name']} {r.get('description','')}"})
    except: pass
    # summarize -> index
    summaries=[]
    for it in items:
        try: summaries.append({'source':it['source'], 'text': _summarize(it['source'], it['text'])})
        except: pass
    if summaries: _add_docs(summaries)
    (DATA_DIR/'daily_brief.md').write_text('\n\n'.join([f"## {d['source']}\n{d['text']}" for d in summaries[:30]]), encoding='utf-8')
    return {'added': len(summaries)}

@app.get('/verify')
def verify():
    return {'kb_size': kb.count(), 'llm_base': BASE_URL, 'model': MODEL, 'embed_model': EMB}

@app.post('/learn/daily')
def learn_now(): return harvest_daily()

@app.post('/memory/add')
def mem_add(body:dict=Body(...)):
    MEM_DIR.mkdir(parents=True,exist_ok=True)
    with open(MEM_DIR/'journal.jsonl','a',encoding='utf-8') as f: f.write(json.dumps(body)+'\n')
    return {'ok': True}

@app.get('/memory/dump')
def mem_dump():
    p=MEM_DIR/'journal.jsonl'
    return {'entries': sum(1 for _ in open(p,encoding='utf-8')) if p.exists() else 0}

@app.post('/youtube/add')
def yt_add(body:dict=Body(...)):
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        m=re.search(r'(?:v=|/shorts/|/live/|youtu\.be/)([\w-]{6,})', body['url'])
        vid=m.group(1) if m else None
        if not vid: return {'ok':False,'error':'no video id'}
        tr=YouTubeTranscriptApi.get_transcript(vid)
        text=' '.join(seg['text'] for seg in tr)
        _add_docs([{'source':'YouTube','text':text}])
        return {'ok':True,'chars':len(text)}
    except Exception as e:
        return {'ok':False,'error':str(e)}

# ---- Library ingest (downloads to frontend/public/library + indexes filenames as docs) ----
@app.post('/library/ingest')
def lib_ingest(body:dict=Body(None)):
    manifest_path = pathlib.Path('sample-library.manifest.json')
    if not manifest_path.exists(): return {'ok':False,'error':'manifest missing'}
    m=json.loads(manifest_path.read_text(encoding='utf-8'))
    items=m.get('items',[])
    report=[]
    for it in items:
        url=it.get('url')
        if not url: continue
        safe=re.sub(r'[^a-z0-9\-]+','_', (it.get('title') or 'doc').lower())
        ext=url.split('?')[0].split('.')[-1].lower()
        fn=f'{safe}.{ext}'
        dst=PUB_LIB/fn
        try:
            r=requests.get(url, timeout=20)
            if r.status_code==200:
                dst.write_bytes(r.content)
                # index shallow metadata (we avoid parsing PDFs here)
                _add_docs([{'source':'Library', 'text': f"{it.get('docType','Doc')} :: {it.get('title','Untitled')} :: /library/{fn}"}])
                report.append({'title':it.get('title'), 'saved': f'/library/{fn}'})
        except Exception as e:
            report.append({'title':it.get('title'), 'error': str(e)})
    return {'ok':True,'ingested': len(report), 'report': report}

# ---- Demo runner: does a full pass so you can show investors ----
@app.post('/demo/installsure')
def demo():
    # 1) seed
    seed_curriculum_and_construction()
    # 2) learn now
    added = harvest_daily().get('added',0)
    # 3) memory
    with open(MEM_DIR/'journal.jsonl','a',encoding='utf-8') as f:
        f.write(json.dumps({'memory':'Tony prefers typed checklists and structured outputs.','tags':['tony','preference']})+'\n')
    # 4) (optional) library ingest if manifest present
    lib = lib_ingest({}) if (pathlib.Path('sample-library.manifest.json').exists()) else {'skipped':True}
    # 5) write a micro "everything ready" receipt
    (DATA_DIR/'demo_receipt.json').write_text(json.dumps({'kb_size':kb.count(),'learn_added':added,'library':lib},indent=2),encoding='utf-8')
    return {'ok':True,'kb_size':kb.count(),'learn_added':added,'library':lib}

# ---- Schedulers: daily learn 7:00, memory snapshots every 10min ----
def snapshot_memory():
    ts=datetime.datetime.utcnow().strftime('%Y%m%d-%H%M')
    with open(MEM_DIR/'journal.jsonl','a',encoding='utf-8') as f: f.write(json.dumps({'ts':ts,'note':'autosnapshot'})+'\n')

sched=BackgroundScheduler()
sched.add_job(harvest_daily,'cron',hour=7,minute=0)
sched.add_job(snapshot_memory,'interval',minutes=10)
sched.start()

# seed once on boot so verify shows non-zero
seed_curriculum_and_construction()
"@
Write-Host "   ✅ FastAPI server created" -ForegroundColor Green

# === 7) INSTALL & RUN SERVER ===
Write-Host "`n🔧 Step 7: Installing Python dependencies..." -ForegroundColor Yellow
Push-Location nexus
python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

Write-Host "`n🔧 Step 8: Starting FastAPI server..." -ForegroundColor Yellow
$env:OPENAI_API_BASE="http://localhost:11434/v1"
$env:OPENAI_API_KEY="ollama"
$env:INSTALLSURE_LLM_MODEL=$CHAT_MODEL
$env:INSTALLSURE_EMBED_MODEL=$EMB_MODEL
Start-Process -FilePath python -ArgumentList "-m uvicorn server:app --host 127.0.0.1 --port 5323" -WindowStyle Hidden
Pop-Location
Start-Sleep 3
Write-Host "   ✅ Server started on http://127.0.0.1:5323" -ForegroundColor Green

# === 8) ONE-COMMAND DEMO RUN ===
Write-Host "`n🔧 Step 9: Running demo..." -ForegroundColor Yellow

# (a) verify LLM + KB
Write-Host "   Verifying LLM and KB..." -ForegroundColor Gray
try {
  $verify = Invoke-RestMethod http://127.0.0.1:5323/verify -TimeoutSec 30
} catch {
  Write-Host "   ⚠️  Warning: Could not verify server (may still be starting up)" -ForegroundColor Yellow
  Start-Sleep 2
  $verify = Invoke-RestMethod http://127.0.0.1:5323/verify -TimeoutSec 30
}

# (b) run daily learn now
Write-Host "   Running daily learning..." -ForegroundColor Gray
try {
  $learn  = Invoke-RestMethod http://127.0.0.1:5323/learn/daily -Method POST -TimeoutSec 60
} catch {
  Write-Host "   ⚠️  Warning: Daily learning may have timed out (still processing)" -ForegroundColor Yellow
  $learn = @{ added = 0; note = "timed out or network issue" }
}

# (c) add a memory (Jarvis-style)
Write-Host "   Adding memory..." -ForegroundColor Gray
Invoke-RestMethod http://127.0.0.1:5323/memory/add -Method POST `
  -ContentType "application/json" `
  -Body (@{ memory="Remember: prefer unit-tested outputs, then code."; tags=@("policy","tests-first") } | ConvertTo-Json)

# (d) optional: ingest your sample library if you filled URLs
Write-Host "   Attempting library ingest..." -ForegroundColor Gray
try {
  $lib = Invoke-RestMethod http://127.0.0.1:5323/library/ingest -Method POST -TimeoutSec 30
} catch { 
  $lib = @{ note = "library ingest skipped (no or invalid URLs)" } 
}

# (e) optional: add a YouTube transcript (paste a real URL later)
# $yt = Invoke-RestMethod http://127.0.0.1:5323/youtube/add -Method POST -ContentType "application/json" -Body (@{ url="https://www.youtube.com/watch?v=XXXXXXXXXXX" } | ConvertTo-Json)

# (f) full demo endpoint (writes nexus/data/demo_receipt.json)
Write-Host "   Running full demo..." -ForegroundColor Gray
try {
  $demo = Invoke-RestMethod http://127.0.0.1:5323/demo/installsure -Method POST -TimeoutSec 60
} catch {
  Write-Host "   ⚠️  Warning: Demo may have timed out (still processing)" -ForegroundColor Yellow
  $demo = @{ kb_size = $verify.kb_size; learn_added = 0; library = @{ skipped = $true } }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✅ NEXUS + INSTALLSURE BOOTSTRAP COMPLETE!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Configuration Summary:" -ForegroundColor Yellow
Write-Host "   LLM Base:  $($verify.llm_base)" -ForegroundColor Gray
Write-Host "   Model:     $($verify.model)" -ForegroundColor Gray
Write-Host "   Embeds:    $($verify.embed_model)" -ForegroundColor Gray
Write-Host "   KB Size:   $($demo.kb_size)" -ForegroundColor Gray
Write-Host "   Learn Add: $($demo.learn_added)" -ForegroundColor Gray
Write-Host "   Library:   $(if($demo.library.skipped){'skipped'} else {'ingested ' + $demo.library.ingested})" -ForegroundColor Gray
Write-Host ""
Write-Host "📁 Output Files:" -ForegroundColor Yellow
Write-Host "   Daily brief: nexus/data/daily_brief.md" -ForegroundColor Gray
Write-Host "   Demo receipt: nexus/data/demo_receipt.json" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Cursor/Copilot OpenAI-compatible Configuration:" -ForegroundColor Yellow
Write-Host "   Base URL: http://localhost:11434/v1" -ForegroundColor Gray
Write-Host "   API Key:  ollama" -ForegroundColor Gray
Write-Host "   Model:    $CHAT_MODEL" -ForegroundColor Gray
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 What to do next:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Edit sample-library.manifest.json with real URLs, then re-run:" -ForegroundColor White
Write-Host "   Invoke-RestMethod http://127.0.0.1:5323/library/ingest -Method POST" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Add a lecture transcript to the KB:" -ForegroundColor White
Write-Host "   Invoke-RestMethod http://127.0.0.1:5323/youtube/add -Method POST ``" -ForegroundColor Gray
Write-Host "     -ContentType `"application/json`" ``" -ForegroundColor Gray
Write-Host "     -Body '{`"url`":`"https://www.youtube.com/watch?v=YOUR_VIDEO`"}'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Point Cursor (or VS Code + Copilot) to your local LLM:" -ForegroundColor White
Write-Host "   Provider: OpenAI-compatible" -ForegroundColor Gray
Write-Host "   Base URL: http://localhost:11434/v1" -ForegroundColor Gray
Write-Host "   API Key:  ollama" -ForegroundColor Gray
Write-Host "   Model:    $CHAT_MODEL" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Done! Server is running at http://127.0.0.1:5323" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
