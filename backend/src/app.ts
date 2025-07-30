import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config, isDevelopment } from './config/environment';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { loggingMiddleware, morganFormat } from './middleware/logging';
import nasaRoutes from './routes/nasaRoutes';
import docsRoutes from './routes/docsRoutes';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(corsMiddleware);

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests from this IP, please try again later.',
    statusCode: 429,
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Logging middleware
app.use(loggingMiddleware);
if (isDevelopment()) {
  app.use(morganFormat);
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/nasa', nasaRoutes);
app.use('/api/docs', docsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NASA Data Explorer API',
    version: '1.0.0',
    endpoints: {
      apod: '/api/nasa/apod',
      marsRovers: '/api/nasa/mars-rovers',
      marsRoverPhotos: '/api/nasa/mars-rovers/:rover/photos',
      epic: '/api/nasa/epic',
      neo: '/api/nasa/neo',
      images: '/api/nasa/images',
      docs: '/api/docs',
    },
    documentation: 'https://api.nasa.gov/',
    features: [
      'Input validation',
      'Response caching',
      'Request logging',
      'Rate limiting',
      'API monitoring',
    ],
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app; 