import { Request, Response } from 'express';
import { marsRoverService } from '../services/marsRoverService';
import { SuccessResponse, ErrorResponse, AsyncRequestHandler } from '../types/express';

export class MarsRoverController {
  /**
   * Get Mars Rover Photos
   */
  static getMarsRoverPhotos: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { rover } = req.params;
      const { sol, earth_date, camera, page } = req.query;

      if (!rover) {
        res.status(400).json({
          error: 'MISSING_ROVER',
          message: 'Rover parameter is required',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const params = {
        ...(sol && { sol: parseInt(sol as string) }),
        ...(earth_date && { earth_date: earth_date as string }),
        ...(camera && { camera: camera as string }),
        ...(page && { page: parseInt(page as string) }),
      };

      // Validate parameters
      const validation = marsRoverService.validateMarsRoverParams(params);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `Mars Rover validation failed: ${validation.errors.join(', ')}`,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const data = await marsRoverService.getMarsRoverPhotos(rover, Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: `Mars rover photos for ${rover} retrieved successfully`,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'MARS_ROVER_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch Mars rover photos',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };

  /**
   * Get Mars Rovers
   */
  static getMarsRovers: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const data = await marsRoverService.getMarsRovers();
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'Mars rovers data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'MARS_ROVERS_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch Mars rovers data',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };

  /**
   * Get Mars Rover Manifest
   */
  static getMarsRoverManifest: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { rover } = req.params;

      if (!rover) {
        res.status(400).json({
          error: 'MISSING_ROVER',
          message: 'Rover parameter is required',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const data = await marsRoverService.getMarsRoverManifest(rover);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: `Mars rover manifest for ${rover} retrieved successfully`,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'MARS_ROVER_MANIFEST_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch Mars rover manifest',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };
} 