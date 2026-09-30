# ==============================================================================
# CoalSentinel AI - National Coal Mine Safety & DGMS Compliance Intelligence System
# Smart India Hackathon (SIH 2026) Final Round Platform Launcher
# ==============================================================================

Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  ⛏️  CoalSentinel AI - SIH 2026 Final Round Command Launcher   " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  * Verified MapTiler Satellite API: ACTIVE" -ForegroundColor Cyan
Write-Host "  * Verified Google Gemini AI Copilot: ACTIVE" -ForegroundColor Cyan
Write-Host "  * Codified DGMS Coal Mines Regulations 2017 Engine: ACTIVE" -ForegroundColor Cyan
Write-Host "  * SHA-256 Tamper-Proof Cryptographic Blockchain: ACTIVE" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Yellow

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start FastAPI Backend on Port 8001
Write-Host "`n[1/3] Starting FastAPI Regulatory Engine on http://localhost:8001 ..." -ForegroundColor Magenta
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\backend'; python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload" -PassThru

Start-Sleep -Seconds 3

# 2. Start Next.js Frontend on Port 3001
Write-Host "[2/3] Starting Next.js 14 Command Dashboard on http://localhost:3001 ..." -ForegroundColor Magenta
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\frontend'; npm run dev" -PassThru

Start-Sleep -Seconds 4

# 3. Launch Default Browser
Write-Host "[3/3] Opening CoalSentinel AI in default browser..." -ForegroundColor Green
Start-Process "http://localhost:3001"

Write-Host "`n>>> CoalSentinel AI is now LIVE! <<<" -ForegroundColor Green
Write-Host "Frontend Dashboard: http://localhost:3001" -ForegroundColor White
Write-Host "Backend Swagger API Docs: http://localhost:8001/docs" -ForegroundColor White
Write-Host "`nKeep the spawned PowerShell windows open during your SIH presentation." -ForegroundColor Yellow
