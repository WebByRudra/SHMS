@echo off
REM SHMS Quick Start Script for Windows

echo.
echo ===================================
echo SHMS - Smart Health Management
echo ===================================
echo.

REM Check if running from correct directory
if not exist "backend" (
    echo Error: backend folder not found. Please run from SHMS root directory.
    exit /b 1
)

REM Start Backend
echo.
echo [1] Starting Backend Server (Flask)...
echo.
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -q -r requirements.txt 2>nul

echo Starting Flask on http://localhost:5000
start python run.py

timeout /t 3 /nobreak

REM Start Frontend
cd ..\frontend

if not exist "node_modules" (
    echo.
    echo [2] Installing Frontend Dependencies...
    echo This may take a minute...
    echo.
    call npm install
)

echo.
echo [3] Starting Frontend (React)...
echo Frontend will open at http://localhost:3000
echo.

call npm start

REM All services started
echo.
echo ===================================
echo Services Starting:
echo - Backend API: http://localhost:5000
echo - Frontend: http://localhost:3000
echo - Simulator: python iot-simulator/simulator.py
echo ===================================
pause
