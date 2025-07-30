import { Router } from 'express';
import { NEOController } from '../controllers/neoController';
import { validateRequest, validationSchemas } from '../middleware/validation';
import { cacheMiddleware, cacheConfig } from '../middleware/cache';

const router = Router();

// NEO (Near Earth Objects) routes
router.get('/', 
  validateRequest(validationSchemas.neo),
  cacheMiddleware(cacheConfig.neo),
  NEOController.getNEOData
);

export default router; 