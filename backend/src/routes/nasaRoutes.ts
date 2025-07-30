import { Router } from 'express';
import { 
  apodRoutes, 
  marsRoverRoutes, 
  epicRoutes, 
  neoRoutes, 
  imageSearchRoutes 
} from './index';

const router = Router();

// Mount individual route modules
router.use('/apod', apodRoutes);
router.use('/mars-rovers', marsRoverRoutes);
router.use('/epic', epicRoutes);
router.use('/neo', neoRoutes);
router.use('/images', imageSearchRoutes);

export default router; 