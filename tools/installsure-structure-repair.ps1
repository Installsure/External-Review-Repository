# ================= InstallSure Structure Repair (No Redesign) =================
# Run this INSIDE your master folder (e.g., C:\InstallSure\FullSetup)
# This script ensures the three expected folders exist and creates minimal stubs
# for missing files to make the existing packs runnable.

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[WARN] $m" -ForegroundColor Yellow }

# Safety: allow scripts in THIS session only + unblock downloaded files
# (Windows-only features, skip on Linux/macOS)
if ($IsWindows -or ($PSVersionTable.PSVersion.Major -lt 6)) {
    try {
        Get-ChildItem -Recurse | Unblock-File -ErrorAction SilentlyContinue | Out-Null
        Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force -ErrorAction SilentlyContinue
    } catch {
        Warn "Could not set execution policy (may need admin rights)"
    }
}

$ROOT = Get-Location
$Core   = Join-Path $ROOT "InstallSure_AllInOne_Pack"
$Demo   = Join-Path $ROOT "InstallSure_Demo_Extended"
$UEv2   = Join-Path $ROOT "UE5_BIM_Walkthrough_AddOn_v2"

New-Item -ItemType Directory -Force -Path $Core,$Demo,$UEv2 | Out-Null

# ---- 1) Core: ensure Install_All.ps1 exists (DO NOT overwrite if present) ----
$InstallAll = Join-Path $Core "Install_All.ps1"
if (-not (Test-Path $InstallAll)) {
  @"
# Core: VS Code (user) + extensions + basic tasks (structure only)
`$ErrorActionPreference = "Stop"
function Info(`$m){ Write-Host "[INFO] `$m" -ForegroundColor Cyan }
function Ok(`$m){ Write-Host "[OK]   `$m" -ForegroundColor Green }
function Warn(`$m){ Write-Host "[WARN] `$m" -ForegroundColor Yellow }
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
# VS Code user install if missing
`$vs = "`$env:LOCALAPPDATA\Programs\Microsoft VS Code"
`$code = Join-Path `$vs "bin\code.cmd"
if (-not (Test-Path `$code)) {
  Info "Installing VS Code (User)..."
  `$tmp = Join-Path `$env:TEMP "vscode_install"
  New-Item -ItemType Directory -Force -Path `$tmp | Out-Null
  `$exe = Join-Path `$tmp "VSCodeUserSetup.exe"
  Invoke-WebRequest -Uri "https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user" -OutFile `$exe
  & `$exe /VERYSILENT /MERGETASKS=!runcode | Out-Null
  Start-Sleep -Seconds 3
  if (-not (Test-Path `$code)) { throw "VS Code install failed." }
  Ok "VS Code installed."
} else { Ok "VS Code present." }
`$env:PATH = "`$vs\bin;`$env:PATH"
# Extensions (structure parity)
`$exts = @("GitHub.copilot","ms-playwright.playwright","anthropic.claude-code","ktiays.aicursor","CodeFactor.repo-status")
Info "Installing extensions..."
foreach(`$e in `$exts){ try { code --install-extension `$e --force | Out-Null; Ok "Installed: `$e" } catch { Warn "Failed: `$e  `$(`$_.Exception.Message)" } }
# Workspace tasks
try {
  `$vscode = ".\.vscode"; New-Item -ItemType Directory -Force -Path `$vscode | Out-Null
  `$tasks = @{ "version"="2.0.0"; "tasks"=@(
    @{ "label"="Playwright: Install Browsers"; "type"="shell"; "command"="npx playwright install"; "problemMatcher"=@() },
    @{ "label"="Playwright: Run All"; "type"="shell"; "command"="npx playwright test"; "problemMatcher"=@() },
    @{ "label"="Lint: ESLint"; "type"="shell"; "command"="npx eslint ."; "problemMatcher"=@() }
  ) }
  (`$tasks|ConvertTo-Json -Depth 6) | Out-File -Encoding UTF8 (Join-Path `$vscode "tasks.json")
  Ok ".vscode/tasks.json created."
} catch { Warn "tasks.json create failed: `$(`$_.Exception.Message)" }
Ok "Core installer finished."
"@ | Out-File -Encoding UTF8 $InstallAll
  Ok "Wrote missing Core installer stub: $InstallAll"
} else { Info "Core installer present." }

# ---- 2) Demo: viewer + estimator + neon schema (stubs only if missing) ----
$ViewerIndex = Join-Path $Demo "viewer\index.html"
if (-not (Test-Path $ViewerIndex)) {
  New-Item -ItemType Directory -Force -Path (Split-Path $ViewerIndex) | Out-Null
  @"
<!doctype html><html><head><meta charset="utf-8"/><title>InstallSure Demo — PDF Tagging</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/><style>body{margin:0;font-family:system-ui,Arial}
header{display:flex;gap:8px;align-items:center;padding:10px;border-bottom:1px solid #ddd}#wrap{display:grid;grid-template-columns:280px 1fr 320px;height:calc(100vh - 52px)}
.col{overflow:auto}#left{border-right:1px solid #eee;padding:10px}#right{border-left:1px solid #eee;padding:10px}#viewer{position:relative;background:#f6f7f9}#pdf{width:100%;height:100%;border:0;background:#fff}
.small{font-size:12px;color:#666}</style></head><body>
<header><strong>InstallSure</strong><input type="file" id="file" accept="application/pdf"/><button id="upload">Open</button>
<button id="export">Export CSV</button><span class="small">Click viewer to drop a tag.</span></header>
<div id="wrap"><div id="left" class="col"><h3>Tag</h3><label>Type</label><select id="type">
<option>RFI</option><option>Defect</option><option>Safety</option><option selected>Takeoff-Assembly</option></select>
<label>Note</label><textarea id="note" rows="4" placeholder="Optional note..."></textarea></div>
<div id="viewer" class="col"><iframe id="pdf"></iframe></div>
<div id="right" class="col"><h3>Tags</h3><ul id="tags"></ul></div></div>
<script>
const pdf=document.getElementById('pdf'),tags=document.getElementById('tags'),type=document.getElementById('type'),note=document.getElementById('note'),file=document.getElementById('file');
let rows=JSON.parse(localStorage.getItem('installsure_tags')||'[]');function render(){tags.innerHTML='';rows.forEach(t=>{const li=document.createElement('li');li.textContent=`[${t.type}] ${t.note||''} @ (${t.x.toFixed(2)}, ${t.y.toFixed(2)})`;tags.appendChild(li);});}
render();document.getElementById('upload').onclick=()=>{const f=file.files?.[0];if(!f){alert('Pick a PDF');return;}pdf.src=URL.createObjectURL(f);}
document.getElementById('viewer').addEventListener('click',ev=>{const r=pdf.getBoundingClientRect();if(r.width<10)return;const x=(ev.clientX-r.left)/r.width,y=(ev.clientY-r.top)/r.height;rows.push({type:type.value,note:note.value,x,y,createdAt:new Date().toISOString()});localStorage.setItem('installsure_tags',JSON.stringify(rows));render();});
document.getElementById('export').onclick=()=>{if(!rows.length){alert('No tags');return;}const out=[['type','note','x','y','page','createdAt'],...rows.map(t=>[t.type,t.note||'',t.x,t.y,1,t.createdAt])];const csv=out.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='tags_export.csv';a.click();};
</script></body></html>
"@ | Out-File -Encoding UTF8 $ViewerIndex
  Ok "Wrote missing Demo viewer stub: $ViewerIndex"
} else { Info "Demo viewer present." }

$Estimator = Join-Path $Demo "estimator\estimator.py"
if (-not (Test-Path $Estimator)) {
  New-Item -ItemType Directory -Force -Path (Split-Path $Estimator) | Out-Null
  @"
import csv, sys, collections
def parse_unit(s): 
    if not s: return "each"
    s=s.lower()
    for k in ["studs","lf","sqft","ea","each","bags","yd"]:
        if k in s: return "each" if k=="ea" else k
    return "each"
if len(sys.argv)<2: 
    print("usage: estimator.py tags_export.csv", file=sys.stderr); sys.exit(1)
groups=collections.Counter()
with open(sys.argv[1], newline='', encoding='utf-8') as f:
    r=csv.DictReader(f)
    for row in r:
        if (row.get("type","").lower()!="takeoff-assembly"): continue
        groups[parse_unit(row.get("note",""))]+=1
w=csv.writer(sys.stdout); w.writerow(["assembly","unit","quantity"])
for unit,qty in groups.items(): w.writerow(["generic-assembly",unit,qty])
"@ | Out-File -Encoding UTF8 $Estimator
  Ok "Wrote missing estimator stub: $Estimator"
} else { Info "Estimator present." }

$Schema = Join-Path $Demo "neon\schema.sql"
if (-not (Test-Path $Schema)) {
  New-Item -ItemType Directory -Force -Path (Split-Path $Schema) | Out-Null
  @"
create table if not exists tags (
  id bigserial primary key,
  project_id text not null,
  tag_type text not null,
  note text,
  page int,
  x double precision not null,
  y double precision not null,
  created_at timestamptz default now()
);
create table if not exists documents (
  id bigserial primary key,
  project_id text not null,
  doc_type text not null,
  title text not null,
  url text,
  content text,
  created_at timestamptz default now()
);
"@ | Out-File -Encoding UTF8 $Schema
  Ok "Wrote missing Neon schema stub: $Schema"
} else { Info "Neon schema present." }

# ---- 3) UE v2: ensure .env.example and Build_Walkthrough.ps1 exist (stubs) ----
$EnvExample = Join-Path $UEv2 ".env.example"
if (-not (Test-Path $EnvExample)) {
  @"
PG_URL=postgres://user:pass@host:5432/dbname
# IFCCONVERT_PATH=C:\Program Files\IfcOpenShell\IfcConvert.exe
"@ | Out-File -Encoding UTF8 $EnvExample
  Ok "Wrote UE .env.example"
} else { Info "UE .env.example present." }

$BuildScript = Join-Path $UEv2 "Build_Walkthrough.ps1"
if (-not (Test-Path $BuildScript)) {
  @"
param([string]`$InputDir = ".\Input",[switch]`$Package)
`$ErrorActionPreference="Stop"
function Info(`$m){ Write-Host "[INFO] `$m" -ForegroundColor Cyan }
function Ok(`$m){ Write-Host "[OK]   `$m" -ForegroundColor Green }
function Warn(`$m){ Write-Host "[WARN] `$m" -ForegroundColor Yellow }
New-Item -ItemType Directory -Force -Path `$InputDir,".\Builds\Windows",".\UE_Project\Saved" | Out-Null
if (-not (Test-Path ".\.env") -and (Test-Path ".\.env.example")){ Copy-Item .\.env.example .\.env -Force; Warn "Created .env; set PG_URL before packaging." }
`$in = Get-ChildItem -Path `$InputDir -File | ? { `$_.Extension -match "^\.(ifc|rvt|skp|fbx|dwg|dwf|pdf)$" } | Select -First 1
if (-not `$in){ Warn "Put a plan/model file in .\Input (ifc/rvt/skp/fbx/dwg/dwf/pdf)"; } else { Info "Input: `$(`$in.Name)" }
`$ueCmd = "C:\Program Files\Epic Games\UE_5.3\Engine\Binaries\Win64\UnrealEditor-Cmd.exe"
if (-not (Test-Path `$ueCmd)){ Warn "Edit UE path in script if different: `$ueCmd" } else { Info "UE commandlet found." }
Ok "UE build script (structure) finished."
"@ | Out-File -Encoding UTF8 $BuildScript
  Ok "Wrote missing UE build script stub: $BuildScript"
} else { Info "UE build script present." }

# ---- 4) Execute core installer now ----
Info "Running Core installer..."
& $InstallAll -Verbose
Ok "Core stage done."

# ---- 5) Print next precise steps (no redesign) ----
Write-Host ""
Ok "Structure repair complete. Next steps (no redesign):"
Write-Host "1) Demo viewer:  " (Join-Path $Demo "viewer\index.html")
Write-Host "   - Open in VS Code (Live Server) or double-click to open in browser."
Write-Host "   - Click to place tags; Export CSV."
Write-Host "   - Estimator:" (Join-Path $Demo "estimator\estimator.py") " ->  python estimator.py ..\viewer\tags_export.csv > estimate_out.csv"
Write-Host ""
Write-Host "2) Neon schema (optional):" $Schema
Write-Host "   - Apply in Neon console (or psql) to persist tags/docs in Postgres."
Write-Host ""
Write-Host "3) Unreal build script:" $BuildScript
Write-Host "   - Put IFC/RVT/DWG/PDF into:" (Join-Path $UEv2 "Input")
Write-Host "   - If Unreal isn't at UE_5.3, edit path at top of Build_Walkthrough.ps1"
Write-Host "   - Run: powershell -ExecutionPolicy Bypass -File `"$BuildScript`" -Verbose"
Write-Host ""
Ok "If any step throws, copy the last ~20 lines of the error here and I'll fix fast."
