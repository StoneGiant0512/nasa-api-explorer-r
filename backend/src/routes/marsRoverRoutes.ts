import { Router } from 'express';
import { MarsRoverController } from '../controllers/marsRoverController';
import { validateRequest, validationSchemas } from '../middleware/validation';
import { cacheMiddleware, cacheConfig } from '../middleware/cache';

const router = Router();

// Mars Rover routes
router.get('/', 
  cacheMiddleware(cacheConfig.marsRover),
  MarsRoverController.getMarsRovers
);

router.get('/:rover/photos', 
  validateRequest(validationSchemas.marsRover),
  cacheMiddleware(cacheConfig.marsRover),
  MarsRoverController.getMarsRoverPhotos
);

router.get('/:rover/manifest', 
  validateRequest(validationSchemas.marsRover),
  cacheMiddleware(cacheConfig.marsRover),
  MarsRoverController.getMarsRoverManifest
);

export default router; 