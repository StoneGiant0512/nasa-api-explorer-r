import { Request, Response } from 'express';
import { nasaService } from '../services/nasaService';
import { SuccessResponse, ErrorResponse, AsyncRequestHandler } from '../types/express';

export class NASAController {
  /**
   * Get Astronomy Picture of the Day
   */
  static getAPOD: AsyncRequestHandler = async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log("APOD request params:", req.query)
    }
    try {
      const { date, start_date, end_date, count, thumbs } = req.query;
      
      const params = {
        ...(date && { date: date as string }),
        ...(start_date && { start_date: start_date as string }),
        ...(end_date && { end_date: end_date as string }),
        ...(count && { count: parseInt(count as string) }),
        ...(thumbs && { thumbs: thumbs === 'true' }),
      };

      const data = await nasaService.getAPOD(Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'APOD data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'APOD_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch APOD data',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };

  /**
   * Get Mars Rover Photos
   */
  static getMarsRoverPhotos: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { rover } = req.params;
      const { sol, earth_date, camera, page } = req.query;

      if (!rover) {
        return res.status(400).json({
          error: 'MISSING_ROVER',
          message: 'Rover parameter is required',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
      }

      const params = {
        ...(sol && { sol: parseInt(sol as string) }),
        ...(earth_date && { earth_date: earth_date as string }),
        ...(camera && { camera: camera as string }),
        ...(page && { page: parseInt(page as string) }),
      };

      const data = await nasaService.getMarsRoverPhotos(rover, Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: `Mars rover photos for ${rover} retrieved successfully`,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'MARS_ROVER_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch Mars rover photos',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };

  /**
   * Get EPIC Data
   */
  static getEPICData: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { date } = req.query;

      const data = await nasaService.getEPICData(date as string);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'EPIC data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'EPIC_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch EPIC data',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };

  /**
   * Get Near Earth Objects
   */
  static getNEOData: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { start_date, end_date, asteroid_id } = req.query;

      const params = {
        ...(start_date && { start_date: start_date as string }),
        ...(end_date && { end_date: end_date as string }),
        ...(asteroid_id && { asteroid_id: asteroid_id as string }),
      };

      const data = await nasaService.getNEOData(Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'NEO data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'NEO_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch NEO data',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };

  /**
   * Search NASA Images
   */
  static searchNASAImages: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { 
        q, center, description, keywords, location, nasa_id, 
        photographer, title, year_start, year_end, media_type, page 
      } = req.query;

      const params = {
        ...(q && { q: q as string }),
        ...(center && { center: center as string }),
        ...(description && { description: description as string }),
        ...(keywords && { keywords: keywords as string }),
        ...(location && { location: location as string }),
        ...(nasa_id && { nasa_id: nasa_id as string }),
        ...(photographer && { photographer: photographer as string }),
        ...(title && { title: title as string }),
        ...(year_start && { year_start: year_start as string }),
        ...(year_end && { year_end: year_end as string }),
        ...(media_type && { media_type: media_type as 'image' | 'video' | 'audio' }),
        ...(page && { page: parseInt(page as string) }),
      };

      const data = await nasaService.searchNASAImages(Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'NASA images search completed successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'NASA_IMAGE_SEARCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to search NASA images',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };

  /**
   * Get Mars Rovers
   */
  static getMarsRovers: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const data = await nasaService.getMarsRovers();
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'Mars rovers data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'MARS_ROVERS_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch Mars rovers data',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };

  /**
   * Get Mars Rover Manifest
   */
  static getMarsRoverManifest: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { rover } = req.params;

      if (!rover) {
        return res.status(400).json({
          error: 'MISSING_ROVER',
          message: 'Rover parameter is required',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
      }

      const data = await nasaService.getMarsRoverManifest(rover);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: `Mars rover manifest for ${rover} retrieved successfully`,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'MARS_ROVER_MANIFEST_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch Mars rover manifest',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };

  /**
   * Get EPIC Image URL
   */
  static getEPICImageURL: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { identifier, date, image, enhanced } = req.query;

      if (!identifier || !date || !image) {
        return res.status(400).json({
          error: 'MISSING_PARAMETERS',
          message: 'identifier, date, and image parameters are required',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
      }

      const imageURL = enhanced === 'true' 
        ? nasaService.getEPICEnhancedImageURL(identifier as string, date as string, image as string)
        : nasaService.getEPICImageURL(identifier as string, date as string, image as string);
      
      const response: SuccessResponse = {
        success: true,
        data: { imageURL },
        message: 'EPIC image URL generated successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'EPIC_IMAGE_URL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to generate EPIC image URL',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  };
} 