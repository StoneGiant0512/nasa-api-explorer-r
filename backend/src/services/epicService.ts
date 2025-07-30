import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config/environment';
import { EPICResponse } from '../types/nasa';

export interface EPICImageURLParams {
  identifier: string;
  date: string;
  image: string;
  enhanced?: boolean;
}

export class EPICService {
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
        console.error('NASA EPIC API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get Earth Polychromatic Imaging Camera (EPIC) data
   */
  async getEPICData(date?: string): Promise<EPICResponse[]> {
    try {
      const endpoint = date ? `/EPIC/api/natural/date/${date}` : '/EPIC/api/natural/latest';
      const response: AxiosResponse<EPICResponse[]> = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch EPIC data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get EPIC data for a specific date
   */
  async getEPICByDate(date: string): Promise<EPICResponse[]> {
    try {
      const response: AxiosResponse<EPICResponse[]> = await this.api.get(`/EPIC/api/natural/date/${date}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch EPIC data for date ${date}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get latest EPIC data
   */
  async getLatestEPIC(): Promise<EPICResponse[]> {
    try {
      const response: AxiosResponse<EPICResponse[]> = await this.api.get('/EPIC/api/natural/latest');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch latest EPIC data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get EPIC image URL
   */
  getEPICImageURL(identifier: string, date: string, image: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${this.baseURL}/EPIC/archive/natural/${year}/${month}/${day}/png/${image}.png?api_key=${this.apiKey}`;
  }

  /**
   * Get EPIC enhanced image URL
   */
  getEPICEnhancedImageURL(identifier: string, date: string, image: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${this.baseURL}/EPIC/archive/enhanced/${year}/${month}/${day}/png/${image}.png?api_key=${this.apiKey}`;
  }

  /**
   * Get EPIC image URL with parameters
   */
  getEPICImageURLWithParams(params: EPICImageURLParams): string {
    const { identifier, date, image, enhanced = false } = params;
    
    if (enhanced) {
      return this.getEPICEnhancedImageURL(identifier, date, image);
    } else {
      return this.getEPICImageURL(identifier, date, image);
    }
  }

  /**
   * Get available EPIC dates
   */
  async getAvailableEPICDates(): Promise<string[]> {
    try {
      const response: AxiosResponse<string[]> = await this.api.get('/EPIC/api/natural/all');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch available EPIC dates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get EPIC data for a date range
   */
  async getEPICByDateRange(startDate: string, endDate: string): Promise<EPICResponse[]> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        throw new Error('Start date must be before end date');
      }

      const availableDates = await this.getAvailableEPICDates();
      const filteredDates = availableDates.filter(date => {
        const dateObj = new Date(date);
        return dateObj >= start && dateObj <= end;
      });

      const allData: EPICResponse[] = [];
      for (const date of filteredDates) {
        try {
          const data = await this.getEPICByDate(date);
          allData.push(...data);
        } catch (error) {
          console.warn(`Failed to fetch EPIC data for ${date}: ${error}`);
        }
      }

      return allData;
    } catch (error) {
      throw new Error(`Failed to fetch EPIC data for date range: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate EPIC parameters
   */
  validateEPICParams(date?: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        errors.push('Invalid date format. Use YYYY-MM-DD');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate EPIC image URL parameters
   */
  validateEPICImageURLParams(params: EPICImageURLParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!params.identifier) {
      errors.push('Identifier is required');
    }

    if (!params.date) {
      errors.push('Date is required');
    } else {
      const dateObj = new Date(params.date);
      if (isNaN(dateObj.getTime())) {
        errors.push('Invalid date format. Use YYYY-MM-DD');
      }
    }

    if (!params.image) {
      errors.push('Image name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const epicService = new EPICService(); 