import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  APODResponse,
  MarsRoverResponse,
  MarsRoversResponse,
  EPICResponse,
  NEOResponse,
  NASAImageResponse,
  APODRequest,
  MarsRoverRequest,
  NEORequest,
  NASAImageRequest,
  ApiResponse,
} from '../types/nasa';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000'),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`Response received from: ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, params?: any): Promise<T> {
    if (import.meta.env.DEV) {
      console.log("endpoint", endpoint)
      console.log("params", params)
    }
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(endpoint, { params });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // APOD (Astronomy Picture of the Day)
  async getAPOD(params?: APODRequest): Promise<APODResponse | APODResponse[]> {
    return this.apiCall<APODResponse | APODResponse[]>('/api/nasa/apod', params);
  }

  // Mars Rovers
  async getMarsRovers(): Promise<MarsRoversResponse> {
    return this.apiCall<MarsRoversResponse>('/api/nasa/mars-rovers');
  }

  async getMarsRoverPhotos(rover: string, params?: MarsRoverRequest): Promise<MarsRoverResponse> {
    return this.apiCall<MarsRoverResponse>(`/api/nasa/mars-rovers/${rover}/photos`, params);
  }

  async getMarsRoverManifest(rover: string): Promise<any> {
    return this.apiCall<any>(`/api/nasa/mars-rovers/${rover}/manifest`);
  }

  // EPIC (Earth Polychromatic Imaging Camera)
  async getEPICData(date?: string): Promise<EPICResponse[]> {
    return this.apiCall<EPICResponse[]>('/api/nasa/epic', date ? { date } : undefined);
  }

  async getEPICImageURL(identifier: string, date: string, image: string, enhanced?: boolean): Promise<{ imageURL: string }> {
    return this.apiCall<{ imageURL: string }>('/api/nasa/epic/image-url', {
      identifier,
      date,
      image,
      enhanced,
    });
  }

  // NEO (Near Earth Objects)
  async getNEOData(params?: NEORequest): Promise<NEOResponse> {
    return this.apiCall<NEOResponse>('/api/nasa/neo', params);
  }

  // NASA Image and Video Library
  async searchNASAImages(params?: NASAImageRequest): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', params);
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.apiCall<any>('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService(); 