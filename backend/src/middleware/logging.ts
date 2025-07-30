import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

export interface RequestLog {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  ip: string;
  userAgent: string;
  timestamp: string;
  query: any;
  params: any;
  body?: any;
}

class RequestLogger {
  private logs: RequestLog[] = [];
  private readonly maxLogs = 1000;

  log(requestLog: RequestLog): void {
    this.logs.push(requestLog);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${requestLog.timestamp}] ${requestLog.method} ${requestLog.url} - ${requestLog.statusCode} (${requestLog.responseTime}ms)`);
    }
  }

  getLogs(limit: number = 100): RequestLog[] {
    return this.logs.slice(-limit);
  }

  getStats(): {
    totalRequests: number;
    averageResponseTime: number;
    statusCodes: Record<number, number>;
    topEndpoints: Array<{ url: string; count: number }>;
  } {
    const statusCodes: Record<number, number> = {};
    const endpointCounts: Record<string, number> = {};
    let totalResponseTime = 0;

    this.logs.forEach(log => {
      statusCodes[log.statusCode] = (statusCodes[log.statusCode] || 0) + 1;
      endpointCounts[log.url] = (endpointCounts[log.url] || 0) + 1;
      totalResponseTime += log.responseTime;
    });

    const topEndpoints = Object.entries(endpointCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([url, count]) => ({ url, count }));

    return {
      totalRequests: this.logs.length,
      averageResponseTime: this.logs.length > 0 ? totalResponseTime / this.logs.length : 0,
      statusCodes,
      topEndpoints,
    };
  }

  clear(): void {
    this.logs = [];
  }
}

export const requestLogger = new RequestLogger();

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const originalSend = res.send;
  const originalJson = res.json;

  // Override response methods to capture response time
  res.send = function(data: any) {
    logRequest(req, res, startTime);
    return originalSend.call(this, data);
  };

  res.json = function(data: any) {
    logRequest(req, res, startTime);
    return originalJson.call(this, data);
  };

  next();
};

const logRequest = (req: Request, res: Response, startTime: number) => {
  const responseTime = Date.now() - startTime;
  
  const log: RequestLog = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    responseTime,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
    timestamp: new Date().toISOString(),
    query: req.query,
    params: req.params,
    body: req.method !== 'GET' ? req.body : undefined,
  };

  requestLogger.log(log);
};

// Custom Morgan format for better logging
export const morganFormat = morgan((tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const responseTime = tokens['response-time'](req, res);
  const contentLength = tokens.res(req, res, 'content-length');
  const userAgent = tokens['user-agent'](req, res);

  return `${method} ${url} ${status} ${responseTime}ms ${contentLength} - ${userAgent}`;
});

// API endpoint to get request statistics
export const getRequestStats = (req: Request, res: Response) => {
  const stats = requestLogger.getStats();
  res.json({
    success: true,
    data: stats,
    message: 'Request statistics retrieved successfully',
    timestamp: new Date().toISOString(),
  });
};

// API endpoint to get recent logs
export const getRecentLogs = (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  const logs = requestLogger.getLogs(limit);
  
  res.json({
    success: true,
    data: logs,
    message: 'Recent request logs retrieved successfully',
    timestamp: new Date().toISOString(),
  });
}; 