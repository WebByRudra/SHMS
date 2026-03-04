#!/bin/bash

# SHMS Quick Start Script for macOS/Linux

echo ""
echo "==================================="
echo "SHMS - Smart Health Management"
echo "==================================="
echo ""

# Check if running from correct directory
if [ ! -d "backend" ]; then
    echo "Error: backend folder not found. Please run from SHMS root directory."
    exit 1
fi

# Start Backend
echo ""
echo "[1] Starting Backend Server (Flask)..."
echo ""
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "Starting Flask on http://localhost:5000"
python run.py &
BACKEND_PID=$!

sleep 3

# Start Frontend
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo ""
    echo "[2] Installing Frontend Dependencies..."
    echo "This may take a minute..."
    echo ""
    npm install
fi

echo ""
echo "[3] Starting Frontend (React)..."
echo "Frontend will open at http://localhost:3000"
echo ""

npm start &
FRONTEND_PID=$!

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID

# Cleanup
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
