#!/bin/bash

echo "🔧 Setting up TapNOrder dependencies..."

# Frontend
echo ""
echo "📱 Installing Frontend dependencies..."
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..

# Dashboard
echo ""
echo "💻 Installing Dashboard dependencies..."
cd dashboard
rm -rf node_modules package-lock.json
npm install
cd ..

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Run './start_dev.sh' to start all services"
echo "2. Or manually start each service:"
echo "   - Frontend:  cd frontend && npm run dev"
echo "   - Dashboard: cd dashboard && npm run dev -- -p 3001"
echo "   - Backend:   cd Backend && source venv/bin/activate && uvicorn app.main:app --reload"
