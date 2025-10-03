param(
  [string]$ManifestPath = "sample-library.manifest.json"
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path $ManifestPath)) { throw "Manifest not found: $ManifestPath" }
$manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
$projectId = $manifest.projectId
$items = $manifest.items
if (-not $items) { throw "No items in manifest." }

$dlRoot = "samples/library"
$pubRoot = "applications/installsure/frontend/public/library"
New-Item -ItemType Directory -Force -Path $dlRoot | Out-Null
New-Item -ItemType Directory -Force -Path $pubRoot | Out-Null

$report = @()
foreach ($i in $items) {
  $url = $i.url
  if (-not $url) { continue }
  $name = ($i.title -replace '[^a-zA-Z0-9\-]+','_').ToLower()
  $ext = [System.IO.Path]::GetExtension($url)
  if (-not $ext) { $ext = ".bin" }
  $fn = "$name$ext"
  $dst = Join-Path $dlRoot $fn
  try {
    Invoke-WebRequest -Uri $url -OutFile $dst -UseBasicParsing -TimeoutSec 120
    Copy-Item $dst (Join-Path $pubRoot $fn) -Force
    $report += [PSCustomObject]@{ title=$i.title; url=$url; saved=$dst; public="/library/$fn"; docType=$i.docType }
  } catch {
    $report += [PSCustomObject]@{ title=$i.title; url=$url; error=$_.Exception.Message }
  }
}
$report | ConvertTo-Json -Depth 5 | Set-Content "samples/library-download-report.json" -Encoding UTF8
Write-Host "[OK] Downloaded. See samples/library-download-report.json"
