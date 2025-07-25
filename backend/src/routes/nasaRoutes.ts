import { Router } from 'express';
import { NASAController } from '../controllers/nasaController';

const router = Router();

// APOD (Astronomy Picture of the Day) routes
router.get('/apod', NASAController.getAPOD);

// Mars Rover routes
router.get('/mars-rovers', NASAController.getMarsRovers);
router.get('/mars-rovers/:rover/photos', NASAController.getMarsRoverPhotos);
router.get('/mars-rovers/:rover/manifest', NASAController.getMarsRoverManifest);

// EPIC (Earth Polychromatic Imaging Camera) routes
router.get('/epic', NASAController.getEPICData);
router.get('/epic/image-url', NASAController.getEPICImageURL);

// NEO (Near Earth Objects) routes
router.get('/neo', NASAController.getNEOData);

// NASA Image and Video Library routes
router.get('/images', NASAController.searchNASAImages);

export default router; 