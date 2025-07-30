import axios, { AxiosInstance } from 'axios';
import { NEOResponse, NEORequest, ApiResponse } from '../types/nasa';

class NEOService {
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
          console.log(`[NEO Service] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[NEO Service] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[NEO Service] Response received from: ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        console.error('[NEO Service] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, params?: any): Promise<T> {
    if (import.meta.env.DEV) {
      console.log("[NEO Service] endpoint:", endpoint);
      console.log("[NEO Service] params:", params);
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

  // Get NEO data
  async getNEOData(params?: NEORequest): Promise<NEOResponse> {
    return this.apiCall<NEOResponse>('/api/nasa/neo', params);
  }

  // Get NEO data for a date range
  async getNEOByDateRange(startDate: string, endDate: string): Promise<NEOResponse> {
    return this.apiCall<NEOResponse>('/api/nasa/neo', { start_date: startDate, end_date: endDate });
  }

  // Get NEO data for a specific asteroid
  async getNEOByAsteroidId(asteroidId: string): Promise<NEOResponse> {
    return this.apiCall<NEOResponse>('/api/nasa/neo', { asteroid_id: asteroidId });
  }

  // Get hazardous NEOs
  async getHazardousNEOs(startDate?: string, endDate?: string): Promise<NEOResponse> {
    const params: NEORequest = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await this.getNEOData(params);
    
    // Filter for hazardous asteroids
    const hazardousNEOs: { [date: string]: any[] } = {};
    Object.keys(response.near_earth_objects).forEach(date => {
      hazardousNEOs[date] = response.near_earth_objects[date].filter(
        neo => neo.is_potentially_hazardous_asteroid
      );
    });
    
    return {
      ...response,
      near_earth_objects: hazardousNEOs
    };
  }

  // Get NEO summary statistics
  async getNEOSummary(startDate?: string, endDate?: string): Promise<{
    total: number;
    hazardous: number;
    averageSize: number;
    closestApproach: any;
  }> {
    const response = await this.getNEOData({ start_date: startDate, end_date: endDate });
    
    let total = 0;
    let hazardous = 0;
    let totalSize = 0;
    let closestApproach = null;
    let minDistance = Infinity;
    
    Object.values(response.near_earth_objects).forEach(neos => {
      neos.forEach(neo => {
        total++;
        if (neo.is_potentially_hazardous_asteroid) hazardous++;
        
        const avgDiameter = (neo.estimated_diameter.kilometers.estimated_diameter_min + 
                           neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;
        totalSize += avgDiameter;
        
        neo.close_approach_data.forEach(approach => {
          const distance = parseFloat(approach.miss_distance.kilometers);
          if (distance < minDistance) {
            minDistance = distance;
            closestApproach = { neo, approach };
          }
        });
      });
    });
    
    return {
      total,
      hazardous,
      averageSize: total > 0 ? totalSize / total : 0,
      closestApproach
    };
  }

  // Get NEOs by size range
  async getNEOsBySize(minSize: number, maxSize: number, startDate?: string, endDate?: string): Promise<NEOResponse> {
    const response = await this.getNEOData({ start_date: startDate, end_date: endDate });
    
    const filteredNEOs: { [date: string]: any[] } = {};
    Object.keys(response.near_earth_objects).forEach(date => {
      filteredNEOs[date] = response.near_earth_objects[date].filter(neo => {
        const avgDiameter = (neo.estimated_diameter.kilometers.estimated_diameter_min + 
                           neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;
        return avgDiameter >= minSize && avgDiameter <= maxSize;
      });
    });
    
    return {
      ...response,
      near_earth_objects: filteredNEOs
    };
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

  getFormattedDistance(distanceKm: string): string {
    const distance = parseFloat(distanceKm);
    if (distance < 1000) {
      return `${distance.toFixed(2)} km`;
    } else if (distance < 1000000) {
      return `${(distance / 1000).toFixed(2)} thousand km`;
    } else {
      return `${(distance / 1000000).toFixed(2)} million km`;
    }
  }

  getFormattedVelocity(velocityKmS: string): string {
    const velocity = parseFloat(velocityKmS);
    return `${velocity.toFixed(2)} km/s`;
  }

  getHazardousColor(isHazardous: boolean): string {
    return isHazardous ? 'text-red-400' : 'text-green-400';
  }

  getSizeCategory(diameterKm: { estimated_diameter_min: number; estimated_diameter_max: number }): string {
    const avgDiameter = (diameterKm.estimated_diameter_min + diameterKm.estimated_diameter_max) / 2;
    
    if (avgDiameter < 0.1) return 'Small';
    if (avgDiameter < 1) return 'Medium';
    if (avgDiameter < 10) return 'Large';
    return 'Very Large';
  }

  getSizeColor(sizeCategory: string): string {
    switch (sizeCategory) {
      case 'Small': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Large': return 'text-orange-400';
      case 'Very Large': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  getRandomDateRange(): { startDate: string; endDate: string } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    
    return {
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    };
  }
}

// Export singleton instance
export const neoService = new NEOService(); 