#!/usr/bin/env powershell
# Quick start script for Health NEXUS server
# Usage: .\start-server.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  🏥 Health NEXUS Server Starter" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to server directory
cd C:\workspace\server

# Kill any existing Node processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
$logFile = "C:\workspace\server.log"
$proc = Start-Process node -ArgumentList "index.js" -RedirectStandardOutput $logFile -PassThru
Start-Sleep -Seconds 2

# Check if server started successfully
if ($proc.HasExited) {
    Write-Host "✗ Server failed to start. Checking logs..." -ForegroundColor Red
    Get-Content $logFile
} else {
    Write-Host ""
    Write-Host "✓ Server started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access the application at:" -ForegroundColor Cyan
    Write-Host "  http://localhost:3000/health-nexus.html" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Server logs are being written to:" -ForegroundColor Cyan
    Write-Host "  $logFile" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Default test credentials:" -ForegroundColor Cyan
    Write-Host "  Aadhaar: 123412341234" -ForegroundColor Yellow
    Write-Host "  OTP: (Check server console)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Magenta
    
    # Keep the script running and monitor the process
    while (!$proc.HasExited) {
        Start-Sleep -Seconds 5
    }
    
    Write-Host ""
    Write-Host "Server has stopped." -ForegroundColor Red
}
