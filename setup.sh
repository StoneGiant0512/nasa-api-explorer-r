#!/bin/bash

echo "🚀 Setting up NASA Data Explorer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file for backend..."
    cat > .env << EOF
PORT=5000
NODE_ENV=development
NASA_API_KEY=bHPsKvR5LHFS7WZqkoZmDu5hhCtlth3MBhuUhJVx
NASA_API_BASE_URL=https://api.nasa.gov
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ Backend .env file created"
fi

# Build backend
echo "Building backend..."
npm run build

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file for frontend..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000
EOF
    echo "✅ Frontend .env file created"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "For a free NASA API key, visit: https://api.nasa.gov/" 