import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  APODResponse,
  MarsRoverResponse,
  EPICResponse,
  NEOResponse,
  NASAImageResponse,
  APODRequest,
  MarsRoverRequest,
  NEORequest,
  NASAImageRequest
} from '../types/nasa';

export class NASAService {
  private api: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    this.baseURL = process.env.NASA_API_BASE_URL || 'https://api.nasa.gov';
    
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
        console.error('NASA API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get Astronomy Picture of the Day
   */
  async getAPOD(params?: APODRequest): Promise<APODResponse | APODResponse[]> {
    try {
      console.log("[params]", params)
      const response: AxiosResponse<APODResponse | APODResponse[]> = await this.api.get('/planetary/apod', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch APOD: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Mars Rover Photos
   */
  async getMarsRoverPhotos(rover: string, params?: MarsRoverRequest): Promise<MarsRoverResponse> {
    try {
      const response: AxiosResponse<MarsRoverResponse> = await this.api.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Mars Rover photos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
   * Search NASA Image and Video Library
   */
  async searchNASAImages(params?: NASAImageRequest): Promise<NASAImageResponse> {
    try {
      const response: AxiosResponse<NASAImageResponse> = await this.api.get('/search', {
        params: {
          ...params,
          media_type: params?.media_type || 'image',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search NASA images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available Mars rovers
   */
  async getMarsRovers(): Promise<any> {
    try {
      const response: AxiosResponse = await this.api.get('/mars-photos/api/v1/rovers');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Mars rovers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Mars rover manifest
   */
  async getMarsRoverManifest(rover: string): Promise<any> {
    try {
      const response: AxiosResponse = await this.api.get(`/mars-photos/api/v1/manifests/${rover}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Mars rover manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
   * Get EPIC image URL for enhanced images
   */
  getEPICEnhancedImageURL(identifier: string, date: string, image: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${this.baseURL}/EPIC/archive/enhanced/${year}/${month}/${day}/png/${image}.png?api_key=${this.apiKey}`;
  }
}

// Export singleton instance
export const nasaService = new NASAService(); 