import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new MemoryCache();

// Clean up expired entries every 10 minutes
setInterval(() => cache.cleanup(), 10 * 60 * 1000);

export const cacheMiddleware = (ttl: number = 5 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching if cache is disabled
    if (req.query.noCache === 'true') {
      return next();
    }

    const cacheKey = `${req.originalUrl}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      cache.set(cacheKey, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};

export const clearCache = (pattern?: string) => {
  if (pattern) {
    // Clear cache entries matching pattern
    for (const key of cache['cache'].keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

// Cache TTL configurations for different endpoints
export const cacheConfig = {
  apod: 60 * 60 * 1000, // 1 hour (daily data)
  marsRover: 30 * 60 * 1000, // 30 minutes
  epic: 15 * 60 * 1000, // 15 minutes
  neo: 10 * 60 * 1000, // 10 minutes
  imageSearch: 5 * 60 * 1000, // 5 minutes
  default: 5 * 60 * 1000, // 5 minutes
}; 