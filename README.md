# NASA Data Explorer

A modern web application for exploring NASA's vast collection of space data, including Astronomy Picture of the Day, Mars rover photos, Earth imagery, and more.

## Features

- 🌌 **Astronomy Picture of the Day (APOD)** - Daily space images with detailed explanations
- 🚀 **Mars Rovers** - Photos from Curiosity, Opportunity, Spirit, and Perseverance
- 🌍 **EPIC Earth Imagery** - High-resolution images of Earth from DSCOVR satellite
- ☄️ **Near Earth Objects (NEO)** - Track asteroids and comets near Earth
- 🖼️ **NASA Image Library** - Search through NASA's extensive image collection

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for server state management
- **React Router** for navigation

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Axios** for HTTP requests
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nasa-data-explorer
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env file with your NASA API key (optional)

# Build the project
npm run build

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
NASA_API_KEY=DEMO_KEY
NASA_API_BASE_URL=https://api.nasa.gov
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

- `GET /api/nasa/apod` - Astronomy Picture of the Day
- `GET /api/nasa/mars-rovers` - Available Mars rovers
- `GET /api/nasa/mars-rovers/:rover/photos` - Mars rover photos
- `GET /api/nasa/epic` - Earth imagery
- `GET /api/nasa/neo` - Near Earth Objects
- `GET /api/nasa/images` - NASA image search

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── app.ts           # Express app setup
│   │   └── index.ts         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # App entry point
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the PORT in .env file
   - Kill processes using the port

2. **NASA API rate limits**
   - Get a free API key from https://api.nasa.gov/
   - Update NASA_API_KEY in .env

3. **CORS errors**
   - Ensure CORS_ORIGIN matches your frontend URL
   - Check that both servers are running

4. **TypeScript errors**
   - Run `npm install` in both directories
   - Check TypeScript version compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 