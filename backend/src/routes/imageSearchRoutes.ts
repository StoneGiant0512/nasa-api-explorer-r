import { Router } from 'express';
import { ImageSearchController } from '../controllers/imageSearchController';
import { validateRequest, validationSchemas } from '../middleware/validation';
import { cacheMiddleware, cacheConfig } from '../middleware/cache';

const router = Router();

// NASA Image and Video Library routes
router.get('/', 
  validateRequest(validationSchemas.imageSearch),
  cacheMiddleware(cacheConfig.imageSearch),
  ImageSearchController.searchNASAImages
);

export default router; 