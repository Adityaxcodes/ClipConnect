# ClipConnect Server Diagnostic Script
# Run this to check your development environment

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ClipConnect Server Diagnostics" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   [OK] Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] Node.js not found! Please install Node.js" -ForegroundColor Red
}

# Check npm
Write-Host "`n2. Checking npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "   [OK] npm installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] npm not found!" -ForegroundColor Red
}

# Check MongoDB installation
Write-Host "`n3. Checking MongoDB..." -ForegroundColor Yellow
$mongoPath = where.exe mongod 2>$null
if ($mongoPath) {
    Write-Host "   [OK] MongoDB installed at: $mongoPath" -ForegroundColor Green
    $mongoVersion = mongod --version 2>&1 | Select-String "version" | Select-Object -First 1
    Write-Host "   $mongoVersion" -ForegroundColor Green
} else {
    Write-Host "   [WARN] MongoDB not found in PATH" -ForegroundColor Red
    Write-Host "   See MONGODB_SETUP_FIX.md for installation instructions" -ForegroundColor Yellow
}

# Check MongoDB service
Write-Host "`n4. Checking MongoDB Service..." -ForegroundColor Yellow
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "   [OK] MongoDB service is RUNNING" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] MongoDB service exists but is $($mongoService.Status)" -ForegroundColor Yellow
        Write-Host "   TIP: Run 'net start MongoDB' to start it" -ForegroundColor Cyan
    }
} else {
    Write-Host "   [WARN] MongoDB service not found" -ForegroundColor Yellow
    Write-Host "   You may be using MongoDB Atlas or need to install MongoDB" -ForegroundColor Yellow
}

# Check if port 27017 is listening (MongoDB default)
Write-Host "`n5. Checking MongoDB Port (27017)..." -ForegroundColor Yellow
$mongoPort = netstat -ano | Select-String ":27017.*LISTENING"
if ($mongoPort) {
    Write-Host "   [OK] MongoDB is listening on port 27017" -ForegroundColor Green
} else {
    Write-Host "   [WARN] Nothing listening on port 27017" -ForegroundColor Yellow
}

# Check if port 5000 is available/in use
Write-Host "`n6. Checking Server Port (5000)..." -ForegroundColor Yellow
$serverPort = netstat -ano | Select-String ":5000.*LISTENING"
if ($serverPort) {
    Write-Host "   [OK] Server is running on port 5000" -ForegroundColor Green
} else {
    Write-Host "   [INFO] Port 5000 is available" -ForegroundColor Cyan
}

# Check .env file
Write-Host "`n7. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   [OK] .env file exists" -ForegroundColor Green
    $mongoUri = Get-Content .env | Select-String "MONGODB_URI"
    if ($mongoUri) {
        $sanitized = $mongoUri -replace 'password.*@', 'password:***@'
        Write-Host "   MongoDB URI configured: $sanitized" -ForegroundColor Cyan
    }
} else {
    Write-Host "   [WARN] .env file not found" -ForegroundColor Yellow
    Write-Host "   TIP: Run 'Copy-Item .env.example .env'" -ForegroundColor Cyan
}

# Check dependencies
Write-Host "`n8. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   [OK] node_modules folder exists" -ForegroundColor Green
} else {
    Write-Host "   [WARN] node_modules not found" -ForegroundColor Yellow
    Write-Host "   TIP: Run 'npm install'" -ForegroundColor Cyan
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SUMMARY & NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if (!$mongoPath -or !$mongoService -or ($mongoService.Status -ne "Running")) {
    Write-Host "[!] MAIN ISSUE: MongoDB is not running!" -ForegroundColor Red
    Write-Host "`nTo fix the 500 errors:" -ForegroundColor Yellow
    Write-Host "1. Install MongoDB (see MONGODB_SETUP_FIX.md)" -ForegroundColor White
    Write-Host "   OR use MongoDB Atlas (cloud)" -ForegroundColor White
    Write-Host "2. Start MongoDB service: net start MongoDB" -ForegroundColor White
    Write-Host "3. Restart your server: npm run dev`n" -ForegroundColor White
} else {
    Write-Host "[OK] Your environment looks good!" -ForegroundColor Green
    Write-Host "`nTo start development:" -ForegroundColor Yellow
    Write-Host "1. npm run dev" -ForegroundColor White
    Write-Host "2. Open http://localhost:5000/health to verify`n" -ForegroundColor White
}

Write-Host "For detailed setup instructions, see:" -ForegroundColor Cyan
Write-Host "- MONGODB_SETUP_FIX.md`n" -ForegroundColor White

