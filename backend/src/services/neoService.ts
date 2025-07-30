import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config/environment';
import { NEOResponse, NEORequest } from '../types/nasa';

export interface NEOSummary {
  totalCount: number;
  hazardousCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  averageDiameter: {
    min: number;
    max: number;
  };
}

export class NEOService {
  private api: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = config.NASA_API_KEY;
    this.baseURL = config.NASA_API_BASE_URL;
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add API key
    this.api.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        api_key: this.apiKey,
      };
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('NASA NEO API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get Near Earth Objects
   */
  async getNEOData(params?: NEORequest): Promise<NEOResponse> {
    try {
      const response: AxiosResponse<NEOResponse> = await this.api.get('/neo/rest/v1/feed', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch NEO data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get NEO data for a specific date range
   */
  async getNEOByDateRange(startDate: string, endDate: string): Promise<NEOResponse> {
    try {
      const response: AxiosResponse<NEOResponse> = await this.api.get('/neo/rest/v1/feed', {
        params: { start_date: startDate, end_date: endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch NEO data for date range ${startDate} to ${endDate}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get NEO data for a specific asteroid
   */
  async getNEOByAsteroidId(asteroidId: string): Promise<NEOResponse> {
    try {
      const response: AxiosResponse<NEOResponse> = await this.api.get('/neo/rest/v1/feed', {
        params: { asteroid_id: asteroidId },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch NEO data for asteroid ${asteroidId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get hazardous asteroids
   */
  async getHazardousNEOs(startDate?: string, endDate?: string): Promise<NEOResponse> {
    try {
      const params: NEORequest = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await this.getNEOData(params);
      
      // Filter for hazardous asteroids
      const hazardousNEOs: NEOResponse = {
        ...response,
        near_earth_objects: {}
      };

      for (const [date, objects] of Object.entries(response.near_earth_objects)) {
        const hazardousObjects = objects.filter(obj => obj.is_potentially_hazardous_asteroid);
        if (hazardousObjects.length > 0) {
          hazardousNEOs.near_earth_objects[date] = hazardousObjects;
        }
      }

      return hazardousNEOs;
    } catch (error) {
      throw new Error(`Failed to fetch hazardous NEOs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get NEO summary statistics
   */
  async getNEOSummary(startDate?: string, endDate?: string): Promise<NEOSummary> {
    try {
      const params: NEORequest = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await this.getNEOData(params);
      
      let totalCount = 0;
      let hazardousCount = 0;
      let totalMinDiameter = 0;
      let totalMaxDiameter = 0;
      let diameterCount = 0;

      for (const objects of Object.values(response.near_earth_objects)) {
        for (const obj of objects) {
          totalCount++;
          if (obj.is_potentially_hazardous_asteroid) {
            hazardousCount++;
          }

          const diameter = obj.estimated_diameter.kilometers;
          if (diameter.estimated_diameter_min && diameter.estimated_diameter_max) {
            totalMinDiameter += diameter.estimated_diameter_min;
            totalMaxDiameter += diameter.estimated_diameter_max;
            diameterCount++;
          }
        }
      }

      const averageDiameter = diameterCount > 0 ? {
        min: totalMinDiameter / diameterCount,
        max: totalMaxDiameter / diameterCount
      } : { min: 0, max: 0 };

      return {
        totalCount,
        hazardousCount,
        dateRange: {
          start: startDate || 'unknown',
          end: endDate || 'unknown'
        },
        averageDiameter
      };
    } catch (error) {
      throw new Error(`Failed to get NEO summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get NEOs by size range
   */
  async getNEOsBySize(minDiameter: number, maxDiameter: number, startDate?: string, endDate?: string): Promise<NEOResponse> {
    try {
      const params: NEORequest = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await this.getNEOData(params);
      
      const filteredNEOs: NEOResponse = {
        ...response,
        near_earth_objects: {}
      };

      for (const [date, objects] of Object.entries(response.near_earth_objects)) {
        const filteredObjects = objects.filter(obj => {
          const diameter = obj.estimated_diameter.kilometers;
          const avgDiameter = (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
          return avgDiameter >= minDiameter && avgDiameter <= maxDiameter;
        });
        
        if (filteredObjects.length > 0) {
          filteredNEOs.near_earth_objects[date] = filteredObjects;
        }
      }

      return filteredNEOs;
    } catch (error) {
      throw new Error(`Failed to get NEOs by size: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate NEO parameters
   */
  validateNEOParams(params: NEORequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (params.start_date) {
      const startDate = new Date(params.start_date);
      if (isNaN(startDate.getTime())) {
        errors.push('Invalid start_date format. Use YYYY-MM-DD');
      }
    }

    if (params.end_date) {
      const endDate = new Date(params.end_date);
      if (isNaN(endDate.getTime())) {
        errors.push('Invalid end_date format. Use YYYY-MM-DD');
      }
    }

    if (params.start_date && params.end_date) {
      const startDate = new Date(params.start_date);
      const endDate = new Date(params.end_date);
      if (startDate > endDate) {
        errors.push('Start date must be before end date');
      }
    }

    if (params.asteroid_id && typeof params.asteroid_id !== 'string') {
      errors.push('Asteroid ID must be a string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const neoService = new NEOService(); 