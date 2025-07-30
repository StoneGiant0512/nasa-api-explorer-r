import { Request, Response } from 'express';
import { imageSearchService } from '../services/imageSearchService';
import { SuccessResponse, ErrorResponse, AsyncRequestHandler } from '../types/express';

export class ImageSearchController {
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

      // Validate parameters
      const validation = imageSearchService.validateImageSearchParams(params);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `Image search validation failed: ${validation.errors.join(', ')}`,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const data = await imageSearchService.searchNASAImages(Object.keys(params).length > 0 ? params : undefined);
      
      const response: SuccessResponse = {
        success: true,
        data,
        message: 'NASA images search completed successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('NASA API') ? 502 : 500;
      const errorResponse: ErrorResponse = {
        error: 'NASA_IMAGE_SEARCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to search NASA images',
        statusCode,
        timestamp: new Date().toISOString(),
      };
      res.status(statusCode).json(errorResponse);
    }
  };
} 