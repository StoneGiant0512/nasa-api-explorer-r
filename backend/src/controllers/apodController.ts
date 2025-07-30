import { Request, Response } from 'express';
import { apodService } from '../services/apodService';
import { SuccessResponse, ErrorResponse, AsyncRequestHandler } from '../types/express';

export class APODController {
  /**
   * Get Astronomy Picture of the Day
   */
  static getAPOD: AsyncRequestHandler = async (req: Request, res: Response) => {
    try {
      const { date, start_date, end_date, count, thumbs } = req.query;
      
      const params = {
        ...(date && { date: date as string }),
        ...(start_date && { start_date: start_date as string }),
        ...(end_date && { end_date: end_date as string }),
        ...(count && { count: parseInt(count as string) }),
        ...(thumbs && { thumbs: thumbs === 'true' }),
      };

      // Validate parameters
      const validation = apodService.validateAPODParams(params);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `APOD validation failed: ${validation.errors.join(', ')}`,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const data = await apodService.getAPOD(Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'APOD data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'APOD_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch APOD data',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };
} 