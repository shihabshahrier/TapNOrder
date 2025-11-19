#!/bin/bash

# Function to kill all background processes on exit
cleanup() {
    echo "Stopping all servers..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting TapNOrder Development Environment..."

# Kill any existing processes on ports 3000, 3001, 8000
echo "🧹 Cleaning up ports..."
lsof -ti:3000,3001,8000 | xargs kill -9 2>/dev/null || true
sleep 1

# 1. Start Backend
echo "📦 Starting Backend (Port 8000)..."
cd Backend
# Check if venv exists, if not create it
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
# Run migrations/seed if needed (optional, uncomment to auto-seed)
# python seed_data.py
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo "📱 Starting Customer App (Port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 3. Start Dashboard
echo "💻 Starting Dashboard (Port 3001)..."
cd dashboard
npm run dev -- -p 3001 &
DASHBOARD_PID=$!
cd ..

echo "✅ All services are running!"
echo "   - Backend:   http://localhost:8000"
echo "   - Frontend:  http://localhost:3000"
echo "   - Dashboard: http://localhost:3001"
echo "Press Ctrl+C to stop everything."

wait
