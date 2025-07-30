import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// NASA API configuration
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  timestamp: string;
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: { status: 'OK' },
    message: 'NASA API Backend is running',
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

// APOD (Astronomy Picture of the Day)
app.get('/api/nasa/apod', async (req: Request, res: Response) => {
  try {
    const { date, start_date, end_date, count, thumbs } = req.query;
    
    const params: any = {
      api_key: NASA_API_KEY,
      ...(date && { date }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(count && { count }),
      ...(thumbs && { thumbs })
    };

    const response = await axios.get(`${NASA_BASE_URL}/planetary/apod`, { params });
    
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
      message: 'APOD data retrieved successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(apiResponse);
  } catch (error: any) {
    console.error('APOD Error:', error.response?.data || error.message);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'APOD_FETCH_ERROR',
      message: error.response?.data?.msg || error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// Mars Rovers
app.get('/api/nasa/mars-rovers', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers`, {
      params: { api_key: NASA_API_KEY }
    });
    
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
      message: 'Mars rovers data retrieved successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(apiResponse);
  } catch (error: any) {
    console.error('Mars Rovers Error:', error.response?.data || error.message);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'MARS_ROVERS_FETCH_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// Mars Rover Photos
app.get('/api/nasa/mars-rovers/:rover/photos', async (req: Request, res: Response) => {
  try {
    const { rover } = req.params;
    const { sol, earth_date, camera, page } = req.query;
    
    const params: any = {
      api_key: NASA_API_KEY,
      ...(sol && { sol }),
      ...(earth_date && { earth_date }),
      ...(camera && { camera }),
      ...(page && { page })
    };

    const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`, { params });
    
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
      message: `${rover} photos retrieved successfully`,
      timestamp: new Date().toISOString()
    };
    
    res.json(apiResponse);
  } catch (error: any) {
    console.error('Mars Rover Photos Error:', error.response?.data || error.message);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'MARS_ROVER_PHOTOS_FETCH_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// EPIC (Earth Imagery)
app.get('/api/nasa/epic', async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    const params: any = {
      api_key: NASA_API_KEY,
      ...(date && { date })
    };

    const response = await axios.get(`${NASA_BASE_URL}/EPIC/api/natural`, { params });
    
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
      message: 'EPIC data retrieved successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(apiResponse);
  } catch (error: any) {
    console.error('EPIC Error:', error.response?.data || error.message);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'EPIC_FETCH_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// NEO (Near Earth Objects)
app.get('/api/nasa/neo', async (req: Request, res: Response) => {
  try {
    const { start_date, end_date, asteroid_id } = req.query;
    
    const params: any = {
      api_key: NASA_API_KEY,
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(asteroid_id && { asteroid_id })
    };

    const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, { params });
    
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
      message: 'NEO data retrieved successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(apiResponse);
  } catch (error: any) {
    console.error('NEO Error:', error.response?.data || error.message);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'NEO_FETCH_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// NASA Image Search
app.get('/api/nasa/images', async (req: Request, res: Response) => {
  try {
    const { 
      q, center, description, description_508, keywords, location, 
      media_type, nasa_id, photographer, secondary_creator, title, 
      year_start, year_end 
    } = req.query;
    
    const params: any = {
      q,
      center,
      description,
      description_508,
      keywords,
      location,
      media_type,
      nasa_id,
      photographer,
      secondary_creator,
      title,
      year_start,
      year_end
    };

    const response = await axios.get(`${NASA_BASE_URL}/search`, { params });
    
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
      message: 'NASA images retrieved successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(apiResponse);
  } catch (error: any) {
    console.error('NASA Images Error:', error.response?.data || error.message);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'NASA_IMAGES_FETCH_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server Error:', err);
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong on the server',
    timestamp: new Date().toISOString()
  };
  res.status(500).json(errorResponse);
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'NOT_FOUND',
    message: 'Endpoint not found',
    timestamp: new Date().toISOString()
  };
  res.status(404).json(errorResponse);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NASA API Backend running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
}); 