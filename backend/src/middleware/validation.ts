import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/express';

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  transform?: (value: any) => any;
}

export interface ValidationSchema {
  query?: ValidationRule[];
  params?: ValidationRule[];
  body?: ValidationRule[];
}

export class ValidationError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.isOperational = true;
  }
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: string[] = [];

      // Validate query parameters
      if (schema.query) {
        validateFields(req.query, schema.query, errors, 'query');
      }

      // Validate path parameters
      if (schema.params) {
        validateFields(req.params, schema.params, errors, 'params');
      }

      // Validate body parameters
      if (schema.body) {
        validateFields(req.body, schema.body, errors, 'body');
      }

      if (errors.length > 0) {
        const errorResponse: ErrorResponse = {
          error: 'VALIDATION_ERROR',
          message: `Validation failed: ${errors.join(', ')}`,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(errorResponse);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const validateFields = (
  data: any,
  rules: ValidationRule[],
  errors: string[],
  source: string
) => {
  for (const rule of rules) {
    const value = data[rule.field];

    // Check if required field is missing
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${source}.${rule.field} is required`);
      continue;
    }

    // Skip validation if field is not present and not required
    if (value === undefined || value === null) {
      continue;
    }

    // Type validation
    if (rule.type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors.push(`${source}.${rule.field} must be a number`);
        continue;
      }
      if (rule.min !== undefined && numValue < rule.min) {
        errors.push(`${source}.${rule.field} must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && numValue > rule.max) {
        errors.push(`${source}.${rule.field} must be at most ${rule.max}`);
      }
    } else if (rule.type === 'boolean') {
      if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
        errors.push(`${source}.${rule.field} must be a boolean`);
      }
    } else if (rule.type === 'date') {
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        errors.push(`${source}.${rule.field} must be a valid date`);
      }
    } else if (rule.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${source}.${rule.field} must be a string`);
        continue;
      }
      if (rule.min !== undefined && value.length < rule.min) {
        errors.push(`${source}.${rule.field} must be at least ${rule.min} characters`);
      }
      if (rule.max !== undefined && value.length > rule.max) {
        errors.push(`${source}.${rule.field} must be at most ${rule.max} characters`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${source}.${rule.field} format is invalid`);
      }
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${source}.${rule.field} must be one of: ${rule.enum.join(', ')}`);
      }
    }

    // Apply transformation if specified
    if (rule.transform) {
      data[rule.field] = rule.transform(value);
    }
  }
};

// Common validation schemas
export const validationSchemas = {
  apod: {
    query: [
      { field: 'date', type: 'date', required: false },
      { field: 'start_date', type: 'date', required: false },
      { field: 'end_date', type: 'date', required: false },
      { field: 'count', type: 'number', required: false, min: 1, max: 100 },
      { field: 'thumbs', type: 'boolean', required: false },
    ],
  },
  marsRover: {
    params: [
      { field: 'rover', type: 'string', required: true, enum: ['curiosity', 'opportunity', 'spirit', 'perseverance'] },
    ],
    query: [
      { field: 'sol', type: 'number', required: false, min: 0 },
      { field: 'earth_date', type: 'date', required: false },
      { field: 'camera', type: 'string', required: false },
      { field: 'page', type: 'number', required: false, min: 1 },
    ],
  },
  epic: {
    query: [
      { field: 'date', type: 'date', required: false },
      { field: 'identifier', type: 'string', required: false },
      { field: 'image', type: 'string', required: false },
      { field: 'enhanced', type: 'boolean', required: false },
    ],
  },
  neo: {
    query: [
      { field: 'start_date', type: 'date', required: false },
      { field: 'end_date', type: 'date', required: false },
      { field: 'asteroid_id', type: 'string', required: false },
    ],
  },
  imageSearch: {
    query: [
      { field: 'q', type: 'string', required: false, max: 200 },
      { field: 'center', type: 'string', required: false },
      { field: 'description', type: 'string', required: false, max: 500 },
      { field: 'keywords', type: 'string', required: false, max: 200 },
      { field: 'location', type: 'string', required: false },
      { field: 'nasa_id', type: 'string', required: false },
      { field: 'photographer', type: 'string', required: false },
      { field: 'title', type: 'string', required: false, max: 200 },
      { field: 'year_start', type: 'number', required: false, min: 1900, max: new Date().getFullYear() },
      { field: 'year_end', type: 'number', required: false, min: 1900, max: new Date().getFullYear() },
      { field: 'media_type', type: 'string', required: false, enum: ['image', 'video', 'audio'] },
      { field: 'page', type: 'number', required: false, min: 1 },
    ],
  },
}; 