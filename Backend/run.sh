#!/bin/bash

# TapNOrder Backend Run Script

echo "🚀 Starting TapNOrder Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env with your actual configuration values"
    exit 1
fi

# Run the FastAPI application
echo "🔥 Running FastAPI server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
