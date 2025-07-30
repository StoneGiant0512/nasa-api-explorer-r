import { Request, Response } from 'express';
import { epicService } from '../services/epicService';
import { SuccessResponse, ErrorResponse, AsyncRequestHandler } from '../types/express';

export class EPICController {
  /**
   * Get EPIC Data
   */
  static getEPICData: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { date } = req.query;

      // Validate parameters
      const validation = epicService.validateEPICParams(date as string);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `EPIC validation failed: ${validation.errors.join(', ')}`,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const data = await epicService.getEPICData(date as string);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'EPIC data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'EPIC_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch EPIC data',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };

  /**
   * Get EPIC Image URL
   */
  static getEPICImageURL: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { identifier, date, image, enhanced } = req.query;

      const params = {
        identifier: identifier as string,
        date: date as string,
        image: image as string,
        enhanced: enhanced === 'true'
      };

      // Validate parameters
      const validation = epicService.validateEPICImageURLParams(params);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `EPIC image URL validation failed: ${validation.errors.join(', ')}`,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const imageURL = epicService.getEPICImageURLWithParams(params);
      
      const response: SuccessResponse = {
        success: true,
        data: { imageURL },
        message: 'EPIC image URL generated successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'EPIC_IMAGE_URL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to generate EPIC image URL',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };
} 