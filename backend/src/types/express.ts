import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  user?: any;
}

export interface CustomResponse extends Response {
  // Add any custom response properties here
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface SuccessResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends SuccessResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type AsyncRequestHandler = (
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
) => Promise<void>;

export type RequestHandler = (
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
) => void; 