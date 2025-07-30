import { Router } from 'express';
import { getRequestStats, getRecentLogs } from '../middleware/logging';
import { clearCache } from '../middleware/cache';

const router = Router();

// API Documentation
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'NASA Data Explorer API',
      version: '1.0.0',
      description: 'A comprehensive API for exploring NASA\'s space data',
      baseUrl: `${req.protocol}://${req.get('host')}`,
      endpoints: {
        apod: {
          description: 'Astronomy Picture of the Day',
          methods: ['GET'],
          url: '/api/nasa/apod',
          parameters: {
            date: 'YYYY-MM-DD format (optional)',
            start_date: 'YYYY-MM-DD format (optional)',
            end_date: 'YYYY-MM-DD format (optional)',
            count: 'Number of images (1-100, optional)',
            thumbs: 'Boolean for thumbnail images (optional)',
          },
        },
        marsRovers: {
          description: 'Mars Rover data and photos',
          methods: ['GET'],
          endpoints: {
            list: '/api/nasa/mars-rovers',
            photos: '/api/nasa/mars-rovers/:rover/photos',
            manifest: '/api/nasa/mars-rovers/:rover/manifest',
          },
          parameters: {
            rover: 'curiosity, opportunity, spirit, or perseverance',
            sol: 'Mars day number (optional)',
            earth_date: 'YYYY-MM-DD format (optional)',
            camera: 'Camera name (optional)',
            page: 'Page number (optional)',
          },
        },
        epic: {
          description: 'Earth imagery from DSCOVR satellite',
          methods: ['GET'],
          endpoints: {
            data: '/api/nasa/epic',
            imageUrl: '/api/nasa/epic/image-url',
          },
          parameters: {
            date: 'YYYY-MM-DD format (optional)',
            identifier: 'Image identifier (required for image-url)',
            image: 'Image name (required for image-url)',
            enhanced: 'Boolean for enhanced images (optional)',
          },
        },
        neo: {
          description: 'Near Earth Objects data',
          methods: ['GET'],
          url: '/api/nasa/neo',
          parameters: {
            start_date: 'YYYY-MM-DD format (optional)',
            end_date: 'YYYY-MM-DD format (optional)',
            asteroid_id: 'Specific asteroid ID (optional)',
          },
        },
        imageSearch: {
          description: 'NASA Image and Video Library search',
          methods: ['GET'],
          url: '/api/nasa/images',
          parameters: {
            q: 'Search query (optional)',
            center: 'NASA center (optional)',
            description: 'Description search (optional)',
            keywords: 'Keywords search (optional)',
            location: 'Location search (optional)',
            nasa_id: 'NASA ID (optional)',
            photographer: 'Photographer name (optional)',
            title: 'Title search (optional)',
            year_start: 'Start year (optional)',
            year_end: 'End year (optional)',
            media_type: 'image, video, or audio (optional)',
            page: 'Page number (optional)',
          },
        },
        monitoring: {
          description: 'API monitoring and statistics',
          methods: ['GET'],
          endpoints: {
            stats: '/api/docs/stats',
            logs: '/api/docs/logs',
            cache: '/api/docs/cache/clear',
          },
        },
      },
      rateLimiting: {
        windowMs: '15 minutes',
        maxRequests: '100 requests per window',
      },
      caching: {
        enabled: true,
        defaultTTL: '5 minutes',
        endpointSpecific: {
          apod: '1 hour',
          marsRover: '30 minutes',
          epic: '15 minutes',
          neo: '10 minutes',
          imageSearch: '5 minutes',
        },
        bypass: 'Add ?noCache=true to any request',
      },
      errorCodes: {
        VALIDATION_ERROR: '400 - Input validation failed',
        RATE_LIMIT_EXCEEDED: '429 - Too many requests',
        NASA_API_ERROR: '500 - NASA API error',
        NOT_FOUND: '404 - Endpoint not found',
        INTERNAL_SERVER_ERROR: '500 - Internal server error',
      },
    },
    message: 'API documentation retrieved successfully',
    timestamp: new Date().toISOString(),
  });
});

// Request Statistics
router.get('/stats', getRequestStats);

// Recent Request Logs
router.get('/logs', getRecentLogs);

// Cache Management
router.delete('/cache/clear', (req, res) => {
  const pattern = req.query.pattern as string;
  clearCache(pattern);
  
  res.json({
    success: true,
    data: { cleared: true, pattern: pattern || 'all' },
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString(),
  });
});

export default router; 