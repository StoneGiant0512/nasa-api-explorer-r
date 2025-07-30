import { Router } from 'express';
import { EPICController } from '../controllers/epicController';
import { validateRequest, validationSchemas } from '../middleware/validation';
import { cacheMiddleware, cacheConfig } from '../middleware/cache';

const router = Router();

// EPIC (Earth Polychromatic Imaging Camera) routes
router.get('/', 
  validateRequest(validationSchemas.epic),
  cacheMiddleware(cacheConfig.epic),
  EPICController.getEPICData
);

router.get('/image-url', 
  validateRequest(validationSchemas.epic),
  cacheMiddleware(cacheConfig.epic),
  EPICController.getEPICImageURL
);

export default router; 