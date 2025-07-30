# NASA Data Explorer Backend

A robust, high-performance Node.js API backend for exploring NASA's space data with advanced features including caching, validation, monitoring, and comprehensive error handling.

## 🚀 Features

### Core Features
- **Astronomy Picture of the Day (APOD)** - Daily space images with detailed explanations
- **Mars Rover Photos** - Photos from Curiosity, Opportunity, Spirit, and Perseverance
- **EPIC Earth Imagery** - High-resolution Earth images from DSCOVR satellite
- **Near Earth Objects (NEO)** - Track asteroids and comets near Earth
- **NASA Image Library Search** - Search through NASA's extensive media collection

### Advanced Features
- **Input Validation** - Comprehensive request validation with detailed error messages
- **Response Caching** - Intelligent caching with endpoint-specific TTL
- **Request Logging** - Detailed request/response logging with statistics
- **Rate Limiting** - Configurable rate limiting per IP address
- **API Monitoring** - Real-time statistics and performance monitoring
- **Error Handling** - Centralized error handling with proper HTTP status codes
- **Security** - Helmet security headers, CORS protection
- **Documentation** - Auto-generated API documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Security**: Helmet, CORS, Rate Limiting
- **Caching**: In-memory cache with TTL
- **Logging**: Morgan + custom request logger
- **Validation**: Custom validation middleware
- **Monitoring**: Request statistics and performance metrics

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

## ⚙️ Configuration

### Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# NASA API Configuration
NASA_API_KEY=DEMO_KEY
NASA_API_BASE_URL=https://api.nasa.gov

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Caching Configuration
CACHE_ENABLED=true
CACHE_DEFAULT_TTL=300000

# Logging Configuration
LOG_LEVEL=info
LOG_REQUESTS=true
```

### Cache TTL Configuration

Different endpoints have different cache durations:

- **APOD**: 1 hour (daily data)
- **Mars Rover**: 30 minutes
- **EPIC**: 15 minutes
- **NEO**: 10 minutes
- **Image Search**: 5 minutes

## 🚀 Usage

### Development

```bash
# Start development server with hot reload
npm run dev

# Run TypeScript validation
npm run validate

# Run linting
npm run lint
npm run lint:fix
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### NASA Data Endpoints

#### APOD (Astronomy Picture of the Day)
```
GET /api/nasa/apod
GET /api/nasa/apod?date=2024-01-01
GET /api/nasa/apod?start_date=2024-01-01&end_date=2024-01-07
GET /api/nasa/apod?count=5&thumbs=true
```

#### Mars Rovers
```
GET /api/nasa/mars-rovers
GET /api/nasa/mars-rovers/curiosity/photos?sol=1000
GET /api/nasa/mars-rovers/perseverance/photos?earth_date=2024-01-01&camera=NAVCAM
GET /api/nasa/mars-rovers/opportunity/manifest
```

#### EPIC (Earth Imagery)
```
GET /api/nasa/epic
GET /api/nasa/epic?date=2024-01-01
GET /api/nasa/epic/image-url?identifier=20240101&image=epic_1b&enhanced=true
```

#### NEO (Near Earth Objects)
```
GET /api/nasa/neo
GET /api/nasa/neo?start_date=2024-01-01&end_date=2024-01-07
GET /api/nasa/neo?asteroid_id=3542519
```

#### Image Search
```
GET /api/nasa/images?q=mars&media_type=image&year_start=2020
GET /api/nasa/images?center=JPL&photographer=NASA
```

### Monitoring Endpoints

#### API Documentation
```
GET /api/docs
```

#### Request Statistics
```
GET /api/docs/stats
```

#### Recent Request Logs
```
GET /api/docs/logs?limit=50
```

#### Cache Management
```
DELETE /api/docs/cache/clear
DELETE /api/docs/cache/clear?pattern=apod
```

## 🔧 Advanced Features

### Input Validation

All endpoints include comprehensive input validation:

- **Date validation** - Ensures valid date formats
- **Range validation** - Validates numeric ranges
- **Enum validation** - Ensures values match allowed options
- **Type validation** - Validates data types
- **Required field validation** - Ensures required parameters are provided

### Caching

The API includes intelligent caching:

- **Endpoint-specific TTL** - Different cache durations for different data types
- **Cache bypass** - Add `?noCache=true` to any request
- **Cache management** - Clear cache via API endpoints
- **Memory efficient** - Automatic cleanup of expired entries

### Monitoring

Real-time monitoring capabilities:

- **Request statistics** - Total requests, average response time
- **Status code tracking** - Distribution of HTTP status codes
- **Top endpoints** - Most frequently accessed endpoints
- **Response time tracking** - Performance monitoring
- **Request logs** - Detailed request/response logging

### Error Handling

Comprehensive error handling:

- **Validation errors** - Detailed validation failure messages
- **NASA API errors** - Proper handling of external API failures
- **Rate limit errors** - Clear rate limiting messages
- **Network errors** - Timeout and connection error handling
- **Development logging** - Enhanced error logging in development

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Data retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Validation failed: query.date must be a valid date",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin request protection
- **Rate Limiting** - DDoS protection
- **Input Validation** - Injection attack prevention
- **Error Sanitization** - Prevents information leakage

## 📈 Performance Features

- **Response Caching** - Reduces API calls to NASA
- **Compression** - Gzip compression for responses
- **Request Logging** - Performance monitoring
- **Memory Management** - Automatic cache cleanup
- **Connection Pooling** - Efficient HTTP client usage

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Development

### Project Structure
```
src/
├── config/          # Environment configuration
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── app.ts           # Express app setup
└── index.ts         # Server entry point
```

### Adding New Endpoints

1. Create controller in `controllers/`
2. Create route in `routes/`
3. Add validation schema in `middleware/validation.ts`
4. Add cache configuration in `middleware/cache.ts`
5. Update documentation in `routes/docsRoutes.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and validation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 