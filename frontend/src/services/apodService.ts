import axios, { AxiosInstance } from 'axios';
import { APODResponse, APODRequest, ApiResponse } from '../types/nasa';

class APODService {
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
          console.log(`[APOD Service] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[APOD Service] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[APOD Service] Response received from: ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        console.error('[APOD Service] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, params?: any): Promise<T> {
    if (import.meta.env.DEV) {
      console.log("[APOD Service] endpoint:", endpoint);
      console.log("[APOD Service] params:", params);
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

  // Get APOD for a specific date or today
  async getAPOD(params?: APODRequest): Promise<APODResponse | APODResponse[]> {
    return this.apiCall<APODResponse | APODResponse[]>('/api/nasa/apod', params);
  }

  // Get APOD for today
  async getTodayAPOD(): Promise<APODResponse> {
    return this.apiCall<APODResponse>('/api/nasa/apod');
  }

  // Get APOD for a specific date
  async getAPODByDate(date: string): Promise<APODResponse> {
    return this.apiCall<APODResponse>('/api/nasa/apod', { date });
  }

  // Get APOD for a date range
  async getAPODByDateRange(startDate: string, endDate: string): Promise<APODResponse[]> {
    return this.apiCall<APODResponse[]>('/api/nasa/apod', { start_date: startDate, end_date: endDate });
  }

  // Get multiple APOD entries
  async getAPODByCount(count: number): Promise<APODResponse[]> {
    return this.apiCall<APODResponse[]>('/api/nasa/apod', { count });
  }

  // Get APOD with thumbnails
  async getAPODWithThumbnails(params?: APODRequest): Promise<APODResponse | APODResponse[]> {
    return this.apiCall<APODResponse | APODResponse[]>('/api/nasa/apod', { ...params, thumbs: true });
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getRandomDate(): string {
    const startDate = new Date('1995-06-16'); // APOD started on this date
    const endDate = new Date();
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const randomDate = new Date(randomTime);
    return this.formatDate(randomDate);
  }

  isVideo(apod: APODResponse): boolean {
    return apod.media_type === 'video';
  }

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Export singleton instance
export const apodService = new APODService(); 