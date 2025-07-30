import axios, { AxiosInstance } from 'axios';
import { MarsRoverResponse, MarsRoversResponse, MarsRoverRequest, ApiResponse } from '../types/nasa';

class MarsRoverService {
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
          console.log(`[Mars Rover Service] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[Mars Rover Service] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[Mars Rover Service] Response received from: ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        console.error('[Mars Rover Service] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, params?: any): Promise<T> {
    if (import.meta.env.DEV) {
      console.log("[Mars Rover Service] endpoint:", endpoint);
      console.log("[Mars Rover Service] params:", params);
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

  // Get all Mars rovers
  async getMarsRovers(): Promise<MarsRoversResponse> {
    return this.apiCall<MarsRoversResponse>('/api/nasa/mars-rovers');
  }

  // Get photos for a specific rover
  async getMarsRoverPhotos(rover: string, params?: MarsRoverRequest): Promise<MarsRoverResponse> {
    return this.apiCall<MarsRoverResponse>(`/api/nasa/mars-rovers/${rover}/photos`, params);
  }

  // Get manifest for a specific rover
  async getMarsRoverManifest(rover: string): Promise<any> {
    return this.apiCall<any>(`/api/nasa/mars-rovers/${rover}/manifest`);
  }

  // Get photos by sol (Martian day)
  async getPhotosBySol(rover: string, sol: number, camera?: string): Promise<MarsRoverResponse> {
    return this.apiCall<MarsRoverResponse>(`/api/nasa/mars-rovers/${rover}/photos`, { sol, camera });
  }

  // Get photos by Earth date
  async getPhotosByEarthDate(rover: string, earthDate: string, camera?: string): Promise<MarsRoverResponse> {
    return this.apiCall<MarsRoverResponse>(`/api/nasa/mars-rovers/${rover}/photos`, { earth_date: earthDate, camera });
  }

  // Get rover information
  async getRoverInfo(rover: string): Promise<any> {
    const rovers = await this.getMarsRovers();
    return rovers.rovers.find(r => r.name.toLowerCase() === rover.toLowerCase());
  }

  // Get available cameras for a rover
  async getRoverCameras(rover: string): Promise<string[]> {
    const roverInfo = await this.getRoverInfo(rover);
    return roverInfo?.cameras?.map((camera: any) => camera.name) || [];
  }

  // Utility methods
  validateRover(rover: string): boolean {
    const validRovers = ['curiosity', 'opportunity', 'spirit', 'perseverance'];
    return validRovers.includes(rover.toLowerCase());
  }

  getRoverStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-400';
      case 'complete':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedSol(sol: number): string {
    return `Sol ${sol}`;
  }

  getCameraDisplayName(cameraName: string): string {
    const cameraNames: { [key: string]: string } = {
      'FHAZ': 'Front Hazard Avoidance Camera',
      'RHAZ': 'Rear Hazard Avoidance Camera',
      'MAST': 'Mast Camera',
      'CHEMCAM': 'Chemistry and Camera Complex',
      'MAHLI': 'Mars Hand Lens Imager',
      'MARDI': 'Mars Descent Imager',
      'NAVCAM': 'Navigation Camera',
      'PANCAM': 'Panoramic Camera',
      'MINITES': 'Miniature Thermal Emission Spectrometer',
      'ENTRY': 'Entry, Descent, and Landing Camera',
      'EDL_RUCAM': 'Rover Up-Look Camera',
      'EDL_RDCAM': 'Rover Down-Look Camera',
      'EDL_DDCAM': 'Descent Stage Down-Look Camera',
      'EDL_PUCAM1': 'Parachute Up-Look Camera A',
      'EDL_PUCAM2': 'Parachute Up-Look Camera B',
      'NAVCAM_LEFT': 'Navigation Camera - Left',
      'NAVCAM_RIGHT': 'Navigation Camera - Right',
      'MCZ_RIGHT': 'Mast Camera Zoom - Right',
      'MCZ_LEFT': 'Mast Camera Zoom - Left',
      'FRONT_HAZCAM_LEFT_A': 'Front Hazard Avoidance Camera - Left A',
      'FRONT_HAZCAM_RIGHT_A': 'Front Hazard Avoidance Camera - Right A',
      'REAR_HAZCAM_LEFT': 'Rear Hazard Avoidance Camera - Left',
      'REAR_HAZCAM_RIGHT': 'Rear Hazard Avoidance Camera - Right',
      'SKYCAM': 'MEDA Skycam',
      'SUPERCAM_RMI': 'SuperCam Remote Micro Imager',
      'LCAM': 'Lander Vision System Camera'
    };
    return cameraNames[cameraName] || cameraName;
  }
}

// Export singleton instance
export const marsRoverService = new MarsRoverService(); 