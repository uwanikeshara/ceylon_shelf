@echo off
TITLE Book Club Library Management System Launcher
COLOR 0A
cls

echo =========================================================================
echo       BOOK CLUB LIBRARY MANAGEMENT SYSTEM - AUTOMATIC LAUNCHER
echo =========================================================================
echo.

:: 0. Kill any leftover processes holding port 3000 or 5173 to prevent EADDRINUSE
echo [STATUS] Cleaning up any old background server processes on ports 3000 & 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING 2^>nul') do taskkill /f /pid %%a >nul 2>&1

:: 1. Check Node.js and NPM in PATH or common installation locations
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files\nodejs"
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files (x86)\nodejs"
    ) else if exist "%LocalAppData%\Programs\node\node.exe" (
        set "PATH=%PATH%;%LocalAppData%\Programs\node"
    ) else (
        echo [ERROR] Node.js is not installed on this system!
        echo Please download and install Node.js from: https://nodejs.org/
        echo.
        pause
        exit /b 1
    )
)

echo [OK] Node.js environment detected.
echo.

:: 2. Check and setup BackEnd environment (.env)
if not exist "BackEnd\.env" (
    echo [INFO] Creating missing BackEnd\.env configuration file...
    (
        echo PORT=3000
        echo MONGO_URI=mongodb://127.0.0.1:27017/bookclub
        echo ACCESS_TOKEN_SECRET=super_secret_access_token_123456789
        echo REFRESH_TOKEN_SECRET=super_secret_refresh_token_987654321
    ) > BackEnd\.env
    echo [OK] BackEnd\.env created.
)

:: 3. Check and setup FrontEnd environment (.env)
if not exist "FrontEnd\.env" (
    echo [INFO] Creating missing FrontEnd\.env configuration file...
    (
        echo VITE_API_URL=http://localhost:3000/api
    ) > FrontEnd\.env
    echo [OK] FrontEnd\.env created.
)

:: 4. Install BackEnd dependencies if missing
if not exist "BackEnd\node_modules" (
    echo [INFO] BackEnd dependencies missing. Installing packages, please wait...
    cd BackEnd
    call npm install
    cd ..
    echo [OK] BackEnd dependencies installed successfully.
    echo.
)

:: 5. Install FrontEnd dependencies if missing
if not exist "FrontEnd\node_modules" (
    echo [INFO] FrontEnd dependencies missing. Installing packages, please wait...
    cd FrontEnd
    call npm install
    cd ..
    echo [OK] FrontEnd dependencies installed successfully.
    echo.
)

:: 6. Build BackEnd project
echo [STATUS] Compiling BackEnd TypeScript...
cd BackEnd
call npm run build
cd ..

:: 7. Launch BackEnd Server
echo [STATUS] Starting BackEnd Node.js API & WebSockets Server...
start "BookClub Backend Server (Port 3000)" cmd /k "cd BackEnd && npm start"

:: 8. Launch FrontEnd Server
echo [STATUS] Starting FrontEnd Vite React Client...
start "BookClub Frontend Client (Port 5173)" cmd /k "cd FrontEnd && npm run dev"

echo.
echo [STATUS] Waiting 5 seconds for database initialization & servers...
timeout /t 5 /nobreak >nul

:: 9. Launch Google Chrome browser
echo [STATUS] Opening Google Chrome...
set "CHROME_PATH="

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe"
)

if defined CHROME_PATH (
    start "" "%CHROME_PATH%" "http://localhost:5173"
) else (
    echo [NOTE] Chrome executable path not found in default directory, launching via system default...
    start http://localhost:5173
)

echo.
echo =========================================================================
echo    SUCCESS! Application is now running live at http://localhost:5173
echo    - Demo Admin Account: admin@bookclub.com / admin123
echo =========================================================================
echo.
pause
