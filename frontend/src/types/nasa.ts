// NASA API Response Types

export interface APODResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
  thumbnail_url?: string;
}

export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsRoverResponse {
  photos: MarsRoverPhoto[];
}

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

export interface EPICResponse {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
  dscovr_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  lunar_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  sun_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  attitude_quaternions: {
    q0: number;
    q1: number;
    q2: number;
    q3: number;
  };
  date: string;
  coords: {
    lat: number;
    lon: number;
  };
}

export interface NEOObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
    };
    orbiting_body: string;
  }>;
  is_sentry_object: boolean;
}

export interface NEOResponse {
  links: {
    self: string;
    next?: string;
    prev?: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NEOObject[];
  };
}

export interface NASAImageItem {
  data: Array<{
    center: string;
    title: string;
    nasa_id: string;
    date_created: string;
    keywords: string[];
    media_type: string;
    description: string;
    description_508: string;
    secondary_creator: string;
    location: string;
    album: string[];
    photographer: string;
  }>;
  links: Array<{
    href: string;
    rel: string;
    render: string;
  }>;
}

export interface NASAImageResponse {
  collection: {
    href: string;
    items: NASAImageItem[];
    links: Array<{
      href: string;
      rel: string;
      prompt: string;
    }>;
    metadata: {
      total_hits: number;
    };
    version: string;
  };
}

// API Request Types
export interface APODRequest {
  date?: string;
  start_date?: string;
  end_date?: string;
  count?: number;
  thumbs?: boolean;
}

export interface MarsRoverRequest {
  sol?: number;
  earth_date?: string;
  camera?: string;
  page?: number;
  rover?: 'curiosity' | 'opportunity' | 'spirit' | 'perseverance';
}

export interface NEORequest {
  start_date?: string;
  end_date?: string;
  asteroid_id?: string;
}

export interface NASAImageRequest {
  q?: string;
  center?: string;
  description?: string;
  keywords?: string;
  location?: string;
  nasa_id?: string;
  photographer?: string;
  title?: string;
  year_start?: string;
  year_end?: string;
  media_type?: 'image' | 'video' | 'audio';
  page?: number;
}

// Frontend specific types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} 