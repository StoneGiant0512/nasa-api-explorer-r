import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config/environment';
import { MarsRoverResponse, MarsRoverRequest } from '../types/nasa';

export interface MarsRover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: Array<{
    name: string;
    full_name: string;
  }>;
}

export interface MarsRoversResponse {
  rovers: MarsRover[];
}

export interface MarsRoverManifest {
  photo_manifest: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
    photos: Array<{
      sol: number;
      earth_date: string;
      total_photos: number;
      cameras: string[];
    }>;
  };
}

export class MarsRoverService {
  private api: AxiosInstance;
  private apiKey: string;
  private baseURL: string;
  private validRovers = ['curiosity', 'opportunity', 'spirit', 'perseverance'];

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
        console.error('NASA Mars Rover API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get available Mars rovers
   */
  async getMarsRovers(): Promise<MarsRoversResponse> {
    try {
      const response: AxiosResponse<MarsRoversResponse> = await this.api.get('/mars-photos/api/v1/rovers');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Mars rovers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Mars Rover Photos
   */
  async getMarsRoverPhotos(rover: string, params?: MarsRoverRequest): Promise<MarsRoverResponse> {
    try {
      this.validateRover(rover);
      
      const response: AxiosResponse<MarsRoverResponse> = await this.api.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Mars Rover photos for ${rover}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Mars Rover Manifest
   */
  async getMarsRoverManifest(rover: string): Promise<MarsRoverManifest> {
    try {
      this.validateRover(rover);
      
      const response: AxiosResponse<MarsRoverManifest> = await this.api.get(`/mars-photos/api/v1/manifests/${rover}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Mars Rover manifest for ${rover}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get photos by sol (Mars day)
   */
  async getPhotosBySol(rover: string, sol: number, camera?: string): Promise<MarsRoverResponse> {
    try {
      this.validateRover(rover);
      
      const params: MarsRoverRequest = { sol };
      if (camera) {
        params.camera = camera;
      }

      return await this.getMarsRoverPhotos(rover, params);
    } catch (error) {
      throw new Error(`Failed to fetch photos for ${rover} on sol ${sol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get photos by Earth date
   */
  async getPhotosByEarthDate(rover: string, earthDate: string, camera?: string): Promise<MarsRoverResponse> {
    try {
      this.validateRover(rover);
      
      const params: MarsRoverRequest = { earth_date: earthDate };
      if (camera) {
        params.camera = camera;
      }

      return await this.getMarsRoverPhotos(rover, params);
    } catch (error) {
      throw new Error(`Failed to fetch photos for ${rover} on Earth date ${earthDate}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get rover information
   */
  async getRoverInfo(rover: string): Promise<MarsRover> {
    try {
      this.validateRover(rover);
      
      const roversResponse = await this.getMarsRovers();
      const roverInfo = roversResponse.rovers.find(r => r.name.toLowerCase() === rover.toLowerCase());
      
      if (!roverInfo) {
        throw new Error(`Rover ${rover} not found`);
      }
      
      return roverInfo;
    } catch (error) {
      throw new Error(`Failed to get rover info for ${rover}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate rover name
   */
  private validateRover(rover: string): void {
    if (!this.validRovers.includes(rover.toLowerCase())) {
      throw new Error(`Invalid rover name. Must be one of: ${this.validRovers.join(', ')}`);
    }
  }

  /**
   * Validate Mars Rover parameters
   */
  validateMarsRoverParams(params: MarsRoverRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (params.sol !== undefined && (params.sol < 0 || !Number.isInteger(params.sol))) {
      errors.push('Sol must be a non-negative integer');
    }

    if (params.earth_date) {
      const date = new Date(params.earth_date);
      if (isNaN(date.getTime())) {
        errors.push('Invalid Earth date format. Use YYYY-MM-DD');
      }
    }

    if (params.page !== undefined && (params.page < 1 || !Number.isInteger(params.page))) {
      errors.push('Page must be a positive integer');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get available cameras for a rover
   */
  async getRoverCameras(rover: string): Promise<string[]> {
    try {
      const roverInfo = await this.getRoverInfo(rover);
      return roverInfo.cameras.map(camera => camera.name);
    } catch (error) {
      throw new Error(`Failed to get cameras for ${rover}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const marsRoverService = new MarsRoverService(); 