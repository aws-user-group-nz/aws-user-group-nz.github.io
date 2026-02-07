# Start local web server
Write-Host "Starting local web server..." -ForegroundColor Green
Write-Host ""
Write-Host "Open your browser to: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Check if Python is available
if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server 8000
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    python3 -m http.server 8000
} else {
    Write-Host "Python not found. Please install Python or use another web server." -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Install Node.js and run: npx http-server -p 8000" -ForegroundColor Yellow
    pause
}
