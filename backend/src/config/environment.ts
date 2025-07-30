import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  // Server configuration
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  
  // NASA API configuration
  NASA_API_KEY: string;
  NASA_API_BASE_URL: string;
  
  // CORS configuration
  CORS_ORIGIN: string;
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  
  // Caching
  CACHE_ENABLED: boolean;
  CACHE_DEFAULT_TTL: number;
  
  // Logging
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
  LOG_REQUESTS: boolean;
}

const validateConfig = (): EnvironmentConfig => {
  // Provide default values for required environment variables
  const defaultValues = {
    NASA_API_KEY: 'bHPsKvR5LHFS7WZqkoZmDu5hhCtlth3MBhuUhJVx',
    NASA_API_BASE_URL: 'https://api.nasa.gov',
    CORS_ORIGIN: 'http://localhost:3000',
  };

  // Check for missing critical environment variables and provide warnings
  const missingVars = [];
  
  if (!process.env.NASA_API_KEY) {
    console.warn('⚠️  NASA_API_KEY not set, using DEMO_KEY (limited API access)');
  }
  
  if (!process.env.NASA_API_BASE_URL) {
    console.warn('⚠️  NASA_API_BASE_URL not set, using default NASA API URL');
  }
  
  if (!process.env.CORS_ORIGIN) {
    console.warn('⚠️  CORS_ORIGIN not set, using http://localhost:3000');
  }

  return {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    PORT: parseInt(process.env.PORT || '5000'),
    
    NASA_API_KEY: process.env.NASA_API_KEY || defaultValues.NASA_API_KEY,
    NASA_API_BASE_URL: process.env.NASA_API_BASE_URL || defaultValues.NASA_API_BASE_URL,
    
    CORS_ORIGIN: process.env.CORS_ORIGIN || defaultValues.CORS_ORIGIN,
    
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    
    CACHE_ENABLED: process.env.CACHE_ENABLED !== 'false',
    CACHE_DEFAULT_TTL: parseInt(process.env.CACHE_DEFAULT_TTL || '300000'), // 5 minutes
    
    LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'info',
    LOG_REQUESTS: process.env.LOG_REQUESTS !== 'false',
  };
};

export const config = validateConfig();

// Helper functions
export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';
export const isTest = () => config.NODE_ENV === 'test';

export const getNASAConfig = () => ({
  apiKey: config.NASA_API_KEY,
  baseURL: config.NASA_API_BASE_URL,
});

export const getServerConfig = () => ({
  port: config.PORT,
  nodeEnv: config.NODE_ENV,
});

export const getCORSConfig = () => ({
  origin: config.CORS_ORIGIN,
});

export const getRateLimitConfig = () => ({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
});

export const getCacheConfig = () => ({
  enabled: config.CACHE_ENABLED,
  defaultTTL: config.CACHE_DEFAULT_TTL,
});

export const getLoggingConfig = () => ({
  level: config.LOG_LEVEL,
  logRequests: config.LOG_REQUESTS,
}); 