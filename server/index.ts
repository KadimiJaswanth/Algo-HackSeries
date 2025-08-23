import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import { handleDemo } from "./routes/demo";

// Security configuration
const securityConfig = {
  // Rate limiting
  apiLimit: { windowMs: 15 * 60 * 1000, max: 100 },
  authLimit: { windowMs: 15 * 60 * 1000, max: 5 },
  strictLimit: { windowMs: 15 * 60 * 1000, max: 10 },

  // CORS configuration
  corsOptions: {
    origin: process.env.NODE_ENV === 'development' ? true : [
      'https://yourdomain.com', // Add your production domains
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  },

  // Session configuration
  sessionConfig: {
    secret: process.env.SESSION_SECRET || 'ridechain-security-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 minutes
      sameSite: 'strict' as const,
    },
  },
};

// Simple rate limiting implementation
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(windowMs: number, max: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const key = `${ip}:${req.path}`;

    let bucket = rateLimitStore.get(key);

    if (!bucket || now > bucket.resetTime) {
      bucket = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, bucket);
    }

    bucket.count++;

    if (bucket.count > max) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded',
        retryAfter: Math.ceil((bucket.resetTime - now) / 1000),
      });
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': max.toString(),
      'X-RateLimit-Remaining': Math.max(0, max - bucket.count).toString(),
      'X-RateLimit-Reset': new Date(bucket.resetTime).toISOString(),
    });

    next();
  };
}

// Input sanitization
function sanitizeInput(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  next();
}

function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return obj
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/script/gi, '')
      .trim();
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

// CSRF protection
function csrfProtection(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.method === 'GET' || req.path.includes('/ping') || req.path.includes('/demo') || req.path.includes('/csrf-token')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = (req.session as any)?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token',
    });
  }

  next();
}

// Security headers
function securityHeaders(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  });
  next();
}

// Request logging
function requestLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - IP: ${req.ip}`);
    return originalSend.call(this, data);
  };

  next();
}

export function createServer() {
  const app = express();

  // Trust proxy for accurate IP detection
  app.set('trust proxy', 1);

  // Security headers (first)
  app.use(securityHeaders);

  // CORS with security configuration
  app.use(cors(securityConfig.corsOptions));

  // Request logging
  app.use(requestLogger);

  // Session management
  app.use(session(securityConfig.sessionConfig));

  // Body parsing with limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Input sanitization
  app.use(sanitizeInput);

  // Rate limiting for API endpoints
  app.use('/api', rateLimit(securityConfig.apiLimit.windowMs, securityConfig.apiLimit.max));

  // CSRF token generation
  app.get('/api/csrf-token', (req, res) => {
    const token = require('crypto').randomBytes(16).toString('hex');
    (req.session as any).csrfToken = token;
    res.json({ csrfToken: token });
  });

  // Public API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({
      message: ping,
      timestamp: new Date().toISOString(),
      security: {
        headers: 'secured',
        rateLimit: 'active',
        sanitization: 'active',
      }
    });
  });

  app.get("/api/demo", handleDemo);

  // Stricter rate limiting for sensitive endpoints
  app.use('/api/auth', rateLimit(securityConfig.authLimit.windowMs, securityConfig.authLimit.max));
  app.use('/api/transaction', rateLimit(securityConfig.strictLimit.windowMs, securityConfig.strictLimit.max));

  // CSRF protection for state-changing operations
  app.use('/api', csrfProtection);

  // Example secure endpoints
  app.post('/api/transaction/submit', (req, res) => {
    res.json({
      message: 'Secure transaction endpoint',
      security: {
        csrfProtected: true,
        rateLimited: true,
        inputSanitized: true,
      },
      data: req.body,
    });
  });

  app.post('/api/auth/login', (req, res) => {
    res.json({
      message: 'Secure login endpoint',
      security: {
        authRateLimited: true,
        csrfProtected: true,
        inputSanitized: true,
      },
      data: req.body,
    });
  });

  // Health check with security info
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      security: {
        version: '1.0.0',
        features: ['rate-limiting', 'csrf-protection', 'input-sanitization', 'security-headers'],
      },
    });
  });

  // Security test endpoint (development only)
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/security/test', (req, res) => {
      res.json({
        message: 'Security features test',
        tests: {
          csrfToken: (req.session as any)?.csrfToken ? 'Generated' : 'Not generated',
          sanitization: 'Active',
          headers: 'Secured',
          rateLimit: 'Active',
          cors: 'Configured',
        },
        note: 'This endpoint is only available in development mode',
      });
    });
  }

  // Global error handler
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', error);

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
  });

  return app;
}
