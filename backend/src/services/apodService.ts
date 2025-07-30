import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config/environment';
import { APODResponse, APODRequest } from '../types/nasa';

export class APODService {
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
        console.error('NASA APOD API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get Astronomy Picture of the Day
   */
  async getAPOD(params?: APODRequest): Promise<APODResponse | APODResponse[]> {
    try {
      const response: AxiosResponse<APODResponse | APODResponse[]> = await this.api.get('/planetary/apod', {
        params
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch APOD: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get APOD for a specific date
   */
  async getAPODByDate(date: string): Promise<APODResponse> {
    try {
      const response: AxiosResponse<APODResponse> = await this.api.get('/planetary/apod', {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch APOD for date ${date}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get multiple APOD images for a date range
   */
  async getAPODByDateRange(startDate: string, endDate: string): Promise<APODResponse[]> {
    try {
      const response: AxiosResponse<APODResponse[]> = await this.api.get('/planetary/apod', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch APOD for date range ${startDate} to ${endDate}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get multiple APOD images by count
   */
  async getAPODByCount(count: number): Promise<APODResponse[]> {
    try {
      const response: AxiosResponse<APODResponse[]> = await this.api.get('/planetary/apod', {
        params: { count }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch ${count} APOD images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate APOD parameters
   */
  validateAPODParams(params: APODRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (params.date) {
      const date = new Date(params.date);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format. Use YYYY-MM-DD');
      }
    }

    if (params.start_date && params.end_date) {
      const start = new Date(params.start_date);
      const end = new Date(params.end_date);
      if (start > end) {
        errors.push('Start date must be before end date');
      }
    }

    if (params.count && (params.count < 1 || params.count > 100)) {
      errors.push('Count must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const apodService = new APODService(); 