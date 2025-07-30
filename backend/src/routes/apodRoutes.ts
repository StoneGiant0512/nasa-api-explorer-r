import { Router } from 'express';
import { APODController } from '../controllers/apodController';
import { validateRequest, validationSchemas } from '../middleware/validation';
import { cacheMiddleware, cacheConfig } from '../middleware/cache';

const router = Router();

// APOD (Astronomy Picture of the Day) routes
router.get('/', 
  validateRequest(validationSchemas.apod),
  cacheMiddleware(cacheConfig.apod),
  APODController.getAPOD
);

export default router; 