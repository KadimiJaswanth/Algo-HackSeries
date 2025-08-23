import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

// Rate limiting configurations
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60, // 15 minutes in seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60,
    });
  },
});

// Strict rate limiting for sensitive endpoints
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many sensitive requests from this IP.',
    retryAfter: 15 * 60,
  },
});

// Authentication rate limiting
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts from this IP.',
    retryAfter: 15 * 60,
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Input validation middleware
export const validateInput = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Invalid input',
          details: validationResult.error.errors,
        });
      }
      
      req.body = validationResult.data;
      next();
    } catch (error) {
      console.error('Input validation error:', error);
      res.status(500).json({
        error: 'Server error during input validation',
      });
    }
  };
};

// CSRF Protection middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET requests and API endpoints that don't modify state
  if (req.method === 'GET' || req.path.startsWith('/api/ping')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token',
    });
  }

  next();
};

// Request sanitization middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    next();
  } catch (error) {
    console.error('Request sanitization error:', error);
    res.status(500).json({
      error: 'Server error during request sanitization',
    });
  }
};

// Object sanitization helper
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script references
    .trim();
}

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com"],
      connectSrc: ["'self'", "https:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
});

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In production, you should whitelist specific origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://localhost:3000',
      'https://localhost:8080',
      // Add your production domains here
    ];

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - IP: ${req.ip}`);
    
    // Log security-relevant events
    if (res.statusCode >= 400) {
      console.log(`Security event: ${res.statusCode} response for ${req.method} ${req.path} from ${req.ip}`);
    }
    
    return originalSend.call(this, data);
  };

  next();
};

// API key validation middleware
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  // Skip API key validation for public endpoints
  if (req.path.startsWith('/api/ping') || req.path.startsWith('/api/demo')) {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'Please provide a valid API key in the X-API-Key header',
    });
  }

  // In production, validate against a database or key management system
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!validApiKeys.includes(apiKey)) {
    console.log(`Invalid API key attempt: ${apiKey} from IP: ${req.ip}`);
    return res.status(401).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid',
    });
  }

  next();
};

// IP whitelisting middleware
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || '';
    
    // Skip in development
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    if (!allowedIPs.includes(clientIP)) {
      console.log(`Blocked request from unauthorized IP: ${clientIP}`);
      return res.status(403).json({
        error: 'IP not allowed',
        message: 'Your IP address is not authorized to access this resource',
      });
    }

    next();
  };
};

// Request size limiting middleware
export const requestSizeLimit = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      const maxSizeBytes = parseSize(maxSize);
      
      if (size > maxSizeBytes) {
        return res.status(413).json({
          error: 'Request too large',
          message: `Request size ${size} bytes exceeds maximum allowed size of ${maxSizeBytes} bytes`,
        });
      }
    }

    next();
  };
};

function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = size.toLowerCase().match(/^(\d+)\s*(b|kb|mb|gb)?$/);
  if (!match) {
    throw new Error(`Invalid size format: ${size}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2] || 'b';
  
  return value * units[unit];
}

// Error handling middleware
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Security middleware error:', error);

  // Don't leak sensitive information in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request',
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack,
    });
  }
};

// Security audit middleware
export const securityAudit = (req: Request, res: Response, next: NextFunction) => {
  // Log security-relevant requests
  const securityEndpoints = ['/auth', '/login', '/register', '/api/transaction', '/api/payment'];
  const isSecurityEndpoint = securityEndpoints.some(endpoint => req.path.includes(endpoint));

  if (isSecurityEndpoint) {
    console.log(`Security audit: ${req.method} ${req.path} from ${req.ip} at ${new Date().toISOString()}`);
    
    // Log headers (excluding sensitive ones)
    const safeHeaders = { ...req.headers };
    delete safeHeaders.authorization;
    delete safeHeaders.cookie;
    delete safeHeaders['x-api-key'];
    
    console.log('Request headers:', safeHeaders);
  }

  next();
};

export default {
  apiLimiter,
  strictLimiter,
  authLimiter,
  validateInput,
  csrfProtection,
  sanitizeRequest,
  securityHeaders,
  corsOptions,
  requestLogger,
  validateApiKey,
  ipWhitelist,
  requestSizeLimit,
  errorHandler,
  securityAudit,
};
