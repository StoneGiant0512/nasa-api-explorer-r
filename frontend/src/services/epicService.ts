import axios, { AxiosInstance } from 'axios';
import { EPICResponse, ApiResponse } from '../types/nasa';

class EPICService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log(`[EPIC Service] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[EPIC Service] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[EPIC Service] Response received from: ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        console.error('[EPIC Service] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, params?: any): Promise<T> {
    if (import.meta.env.DEV) {
      console.log("[EPIC Service] endpoint:", endpoint);
      console.log("[EPIC Service] params:", params);
    }
    try {
      const response = await this.api.get<ApiResponse<T>>(endpoint, { params });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // Get EPIC data for a specific date or latest
  async getEPICData(date?: string): Promise<EPICResponse[]> {
    return this.apiCall<EPICResponse[]>('/api/nasa/epic', date ? { date } : undefined);
  }

  // Get EPIC data for a specific date
  async getEPICByDate(date: string): Promise<EPICResponse[]> {
    return this.apiCall<EPICResponse[]>('/api/nasa/epic', { date });
  }

  // Get latest EPIC data
  async getLatestEPIC(): Promise<EPICResponse[]> {
    return this.apiCall<EPICResponse[]>('/api/nasa/epic');
  }

  // Get EPIC image URL
  async getEPICImageURL(identifier: string, date: string, image: string, enhanced?: boolean): Promise<{ imageURL: string }> {
    return this.apiCall<{ imageURL: string }>('/api/nasa/epic/image-url', {
      identifier,
      date,
      image,
      enhanced,
    });
  }

  // Get enhanced EPIC image URL
  async getEPICEnhancedImageURL(identifier: string, date: string, image: string): Promise<{ imageURL: string }> {
    return this.getEPICImageURL(identifier, date, image, true);
  }

  // Get natural EPIC image URL
  async getEPICNaturalImageURL(identifier: string, date: string, image: string): Promise<{ imageURL: string }> {
    return this.getEPICImageURL(identifier, date, image, false);
  }

  // Get EPIC image URL with parameters
  async getEPICImageURLWithParams(params: {
    identifier: string;
    date: string;
    image: string;
    enhanced?: boolean;
  }): Promise<{ imageURL: string }> {
    return this.apiCall<{ imageURL: string }>('/api/nasa/epic/image-url', params);
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  getAvailableDates(): string[] {
    // EPIC data is available from 2015-06-13 to present
    const startDate = new Date('2015-06-13');
    const endDate = new Date();
    const dates: string[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(this.formatDate(d));
    }
    
    return dates;
  }

  getRandomDate(): string {
    const startDate = new Date('2015-06-13'); // EPIC started on this date
    const endDate = new Date();
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const randomDate = new Date(randomTime);
    return this.formatDate(randomDate);
  }

  formatCoordinates(lat: number, lon: number): string {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const lonDirection = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}°${latDirection}, ${Math.abs(lon).toFixed(2)}°${lonDirection}`;
  }

  getImageTypeLabel(enhanced: boolean): string {
    return enhanced ? 'Enhanced' : 'Natural';
  }

  getImageTypeColor(enhanced: boolean): string {
    return enhanced ? 'text-green-400' : 'text-blue-400';
  }
}

// Export singleton instance
export const epicService = new EPICService(); 