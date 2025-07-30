import { Request, Response } from 'express';
import { neoService } from '../services/neoService';
import { SuccessResponse, ErrorResponse, AsyncRequestHandler } from '../types/express';

export class NEOController {
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

      // Validate parameters
      const validation = neoService.validateNEOParams(params);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `NEO validation failed: ${validation.errors.join(', ')}`,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const data = await neoService.getNEOData(Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'NEO data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'NEO_FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch NEO data',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };
} 