import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config/environment';
import { NASAImageResponse, NASAImageRequest } from '../types/nasa';

export interface ImageSearchResult {
  totalHits: number;
  items: any[];
  links: any[];
}

export interface ImageSearchFilters {
  mediaType?: 'image' | 'video' | 'audio';
  yearStart?: number;
  yearEnd?: number;
  center?: string;
  photographer?: string;
  location?: string;
}

export class ImageSearchService {
  private api: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = config.NASA_API_KEY;
    this.baseURL = config.NASA_API_BASE_URL;
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000, // Longer timeout for image search
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
        console.error('NASA Image Search API Error:', error.response?.data || error.message);
        throw error;
      }
    );
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
   * Search images by keyword
   */
  async searchByKeyword(keyword: string, filters?: ImageSearchFilters): Promise<NASAImageResponse> {
    try {
      const params: NASAImageRequest = { q: keyword };
      
      if (filters?.mediaType) params.media_type = filters.mediaType;
      if (filters?.yearStart) params.year_start = filters.yearStart.toString();
      if (filters?.yearEnd) params.year_end = filters.yearEnd.toString();
      if (filters?.center) params.center = filters.center;
      if (filters?.photographer) params.photographer = filters.photographer;
      if (filters?.location) params.location = filters.location;

      return await this.searchNASAImages(params);
    } catch (error) {
      throw new Error(`Failed to search images by keyword "${keyword}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search images by NASA center
   */
  async searchByCenter(center: string, filters?: ImageSearchFilters): Promise<NASAImageResponse> {
    try {
      const params: NASAImageRequest = { center };
      
      if (filters?.mediaType) params.media_type = filters.mediaType;
      if (filters?.yearStart) params.year_start = filters.yearStart.toString();
      if (filters?.yearEnd) params.year_end = filters.yearEnd.toString();
      if (filters?.photographer) params.photographer = filters.photographer;
      if (filters?.location) params.location = filters.location;

      return await this.searchNASAImages(params);
    } catch (error) {
      throw new Error(`Failed to search images by center "${center}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search images by photographer
   */
  async searchByPhotographer(photographer: string, filters?: ImageSearchFilters): Promise<NASAImageResponse> {
    try {
      const params: NASAImageRequest = { photographer };
      
      if (filters?.mediaType) params.media_type = filters.mediaType;
      if (filters?.yearStart) params.year_start = filters.yearStart.toString();
      if (filters?.yearEnd) params.year_end = filters.yearEnd.toString();
      if (filters?.center) params.center = filters.center;
      if (filters?.location) params.location = filters.location;

      return await this.searchNASAImages(params);
    } catch (error) {
      throw new Error(`Failed to search images by photographer "${photographer}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search images by year range
   */
  async searchByYearRange(yearStart: number, yearEnd: number, filters?: ImageSearchFilters): Promise<NASAImageResponse> {
    try {
      const params: NASAImageRequest = { 
        year_start: yearStart.toString(),
        year_end: yearEnd.toString()
      };
      
      if (filters?.mediaType) params.media_type = filters.mediaType;
      if (filters?.center) params.center = filters.center;
      if (filters?.photographer) params.photographer = filters.photographer;
      if (filters?.location) params.location = filters.location;

      return await this.searchNASAImages(params);
    } catch (error) {
      throw new Error(`Failed to search images by year range ${yearStart}-${yearEnd}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search images by media type
   */
  async searchByMediaType(mediaType: 'image' | 'video' | 'audio', filters?: ImageSearchFilters): Promise<NASAImageResponse> {
    try {
      const params: NASAImageRequest = { media_type: mediaType };
      
      if (filters?.yearStart) params.year_start = filters.yearStart.toString();
      if (filters?.yearEnd) params.year_end = filters.yearEnd.toString();
      if (filters?.center) params.center = filters.center;
      if (filters?.photographer) params.photographer = filters.photographer;
      if (filters?.location) params.location = filters.location;

      return await this.searchNASAImages(params);
    } catch (error) {
      throw new Error(`Failed to search ${mediaType} files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get popular NASA centers
   */
  async getPopularCenters(): Promise<string[]> {
    try {
      // Search for images to get center information
      const response = await this.searchNASAImages({ media_type: 'image', page: 1 });
      
      const centers = new Set<string>();
      response.collection.items.forEach(item => {
        if (item.data && item.data[0] && item.data[0].center) {
          centers.add(item.data[0].center);
        }
      });

      return Array.from(centers);
    } catch (error) {
      throw new Error(`Failed to get popular centers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get search suggestions based on popular keywords
   */
  async getSearchSuggestions(): Promise<string[]> {
    try {
      const suggestions = [
        'mars', 'moon', 'earth', 'satellite', 'spacecraft', 'galaxy', 'nebula',
        'astronaut', 'space station', 'rocket', 'launch', 'solar system',
        'jupiter', 'saturn', 'neptune', 'venus', 'mercury', 'pluto'
      ];

      return suggestions;
    } catch (error) {
      throw new Error(`Failed to get search suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate image search parameters
   */
  validateImageSearchParams(params: NASAImageRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (params.q && params.q.length > 200) {
      errors.push('Search query must be 200 characters or less');
    }

    if (params.description && params.description.length > 500) {
      errors.push('Description must be 500 characters or less');
    }

    if (params.keywords && params.keywords.length > 200) {
      errors.push('Keywords must be 200 characters or less');
    }

    if (params.title && params.title.length > 200) {
      errors.push('Title must be 200 characters or less');
    }

    if (params.year_start) {
      const year = parseInt(params.year_start);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        errors.push(`Year start must be between 1900 and ${new Date().getFullYear()}`);
      }
    }

    if (params.year_end) {
      const year = parseInt(params.year_end);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        errors.push(`Year end must be between 1900 and ${new Date().getFullYear()}`);
      }
    }

    if (params.year_start && params.year_end) {
      const startYear = parseInt(params.year_start);
      const endYear = parseInt(params.year_end);
      if (startYear > endYear) {
        errors.push('Year start must be before year end');
      }
    }

    if (params.media_type && !['image', 'video', 'audio'].includes(params.media_type)) {
      errors.push('Media type must be image, video, or audio');
    }

    if (params.page && (params.page < 1 || !Number.isInteger(params.page))) {
      errors.push('Page must be a positive integer');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const imageSearchService = new ImageSearchService(); 