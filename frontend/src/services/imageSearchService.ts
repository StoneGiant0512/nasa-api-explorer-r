import axios, { AxiosInstance } from 'axios';
import { NASAImageResponse, NASAImageRequest, ApiResponse } from '../types/nasa';

class ImageSearchService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      timeout: 15000, // Longer timeout for image search
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log(`[Image Search Service] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[Image Search Service] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[Image Search Service] Response received from: ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        console.error('[Image Search Service] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, params?: any): Promise<T> {
    if (import.meta.env.DEV) {
      console.log("[Image Search Service] endpoint:", endpoint);
      console.log("[Image Search Service] params:", params);
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

  // Search NASA images with parameters
  async searchNASAImages(params?: NASAImageRequest): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', params);
  }

  // Search by keyword
  async searchByKeyword(keyword: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { q: keyword, page });
  }

  // Search by NASA center
  async searchByCenter(center: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { center, page });
  }

  // Search by description
  async searchByDescription(description: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { description, page });
  }

  // Search by keywords
  async searchByKeywords(keywords: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { keywords, page });
  }

  // Search by location
  async searchByLocation(location: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { location, page });
  }

  // Search by NASA ID
  async searchByNASAId(nasaId: string): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { nasa_id: nasaId });
  }

  // Search by photographer
  async searchByPhotographer(photographer: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { photographer, page });
  }

  // Search by title
  async searchByTitle(title: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { title, page });
  }

  // Search by year range
  async searchByYearRange(yearStart: string, yearEnd: string, page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { year_start: yearStart, year_end: yearEnd, page });
  }

  // Search by media type
  async searchByMediaType(mediaType: 'image' | 'video' | 'audio', page?: number): Promise<NASAImageResponse> {
    return this.apiCall<NASAImageResponse>('/api/nasa/images', { media_type: mediaType, page });
  }

  // Get popular NASA centers
  getPopularCenters(): string[] {
    return [
      'NASA Headquarters',
      'Johnson Space Center',
      'Kennedy Space Center',
      'Jet Propulsion Laboratory',
      'Goddard Space Flight Center',
      'Marshall Space Flight Center',
      'Ames Research Center',
      'Langley Research Center',
      'Glenn Research Center',
      'Armstrong Flight Research Center',
      'Stennis Space Center',
      'Wallops Flight Facility',
      'White Sands Test Facility',
      'Michoud Assembly Facility',
      'Plum Brook Station'
    ];
  }

  // Get search suggestions
  getSearchSuggestions(): string[] {
    return [
      'Mars',
      'Moon',
      'Earth',
      'Saturn',
      'Jupiter',
      'Galaxy',
      'Nebula',
      'Rocket',
      'Space Station',
      'Astronaut',
      'Rover',
      'Telescope',
      'Satellite',
      'Launch',
      'Spacecraft'
    ];
  }

  // Get media type options
  getMediaTypeOptions(): { value: string; label: string }[] {
    return [
      { value: 'image', label: 'Images' },
      { value: 'video', label: 'Videos' },
      { value: 'audio', label: 'Audio' }
    ];
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedYear(yearString: string): string {
    return yearString;
  }

  getMediaTypeLabel(mediaType: string): string {
    switch (mediaType) {
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'audio': return 'Audio';
      default: return 'Unknown';
    }
  }

  getMediaTypeColor(mediaType: string): string {
    switch (mediaType) {
      case 'image': return 'text-blue-400';
      case 'video': return 'text-purple-400';
      case 'audio': return 'text-green-400';
      default: return 'text-gray-400';
    }
  }

  getMediaTypeIcon(mediaType: string): string {
    switch (mediaType) {
      case 'image': return '📷';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📄';
    }
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getRandomSearchTerms(): string[] {
    const terms = [
      'Mars rover',
      'Hubble telescope',
      'International Space Station',
      'Apollo mission',
      'Space shuttle',
      'Satellite',
      'Astronaut',
      'Galaxy',
      'Nebula',
      'Planet'
    ];
    
    const shuffled = [...terms].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  getYearRange(): { start: string; end: string } {
    const currentYear = new Date().getFullYear();
    return {
      start: '1958', // NASA founded
      end: currentYear.toString()
    };
  }
}

// Export singleton instance
export const imageSearchService = new ImageSearchService(); 