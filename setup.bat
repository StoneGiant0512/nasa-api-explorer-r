@echo off
echo 🚀 Setting up NASA Data Explorer...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Backend setup
echo 📦 Setting up backend...
cd backend

REM Install dependencies
echo Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file for backend...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo NASA_API_KEY=DEMO_KEY
        echo NASA_API_BASE_URL=https://api.nasa.gov
        echo CORS_ORIGIN=http://localhost:3000
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX_REQUESTS=100
    ) > .env
    echo ✅ Backend .env file created
)

REM Build backend
echo Building backend...
call npm run build

cd ..

REM Frontend setup
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file for frontend...
    (
        echo VITE_API_URL=http://localhost:5000
    ) > .env
    echo ✅ Frontend .env file created
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Start backend: cd backend ^&^& npm run dev
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo For a free NASA API key, visit: https://api.nasa.gov/
pause 