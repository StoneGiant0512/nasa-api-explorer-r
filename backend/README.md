# Simple NASA API Backend (TypeScript)

A clean, simple TypeScript backend for NASA API integration.

## Features

- 🌌 APOD (Astronomy Picture of the Day)
- 🚀 Mars Rovers and Photos
- 🌍 EPIC Earth Imagery
- ☄️ NEO (Near Earth Objects)
- 🖼️ NASA Image Search
- ✅ TypeScript for type safety
- 🔧 Simple structure

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your NASA API key
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

```env
PORT=5000
NASA_API_KEY=your_nasa_api_key
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/nasa/apod` - Astronomy Picture of the Day
- `GET /api/nasa/mars-rovers` - Available Mars rovers
- `GET /api/nasa/mars-rovers/:rover/photos` - Mars rover photos
- `GET /api/nasa/epic` - Earth imagery
- `GET /api/nasa/neo` - Near Earth Objects
- `GET /api/nasa/images` - NASA image search

## Project Structure

```
backend1/
├── src/
│   └── server.ts          # Main server file
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
├── env.example
└── README.md
```

## Deployment

This backend is designed to be deployed on Render with minimal configuration. 