import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config/env';
import { errorResponse } from './utils/responseFormat';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

// ──────────────────────────────────────────────────────
// ✅ FIX: Trust Proxy MUST be first
// ──────────────────────────────────────────────────────
app.set('trust proxy', 1);

// Root endpoint - Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.head('/', (req, res) => {
  res.status(200).end();
});

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Global Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, Green for success
    console.log(`${color}[${req.method}] ${req.url} - Status: ${res.statusCode}\x1b[0m`);
  });
  next();
});

// ──────────────────────────────────────────────────────
// Security Middlewares
// ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://res.cloudinary.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'no-referrer' },
}));

// Build allowed origins from config plus sensible defaults
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://www.2carvn.com',
  'https://2-ca-rv-n-frontend-imp.vercel.app',
  'https://2-ca-rv-n-frontend-test.vercel.app',
  'https://2-ca-rv-n-frontend-test-5z7584l7q-2carvnorgs-projects.vercel.app', // Current deployment
];

const allowedOrigins = Array.from(new Set([...(config.corsOrigin || []), ...defaultOrigins]));

// CORS middleware with logging for easier debugging of denied origins
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    // Allow non-browser requests (curl, server-to-server)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list OR matches Vercel preview pattern
    const isAllowed = allowedOrigins.includes(origin) || 
                     origin.match(/^https:\/\/[a-zA-Z0-9-]+-2carvnorgs-projects\.vercel\.app$/);
    
    if (isAllowed) {
      console.debug('[CORS] Allowing origin:', origin);
      callback(null, true);
    } else {
      console.warn('[CORS] Denying origin:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 3600,
};

app.use(cors(corsOptions));

// Ensure preflight OPTIONS requests always receive CORS headers
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'OPTIONS') return next();

  const origin = req.headers.origin as string | undefined;

  // If no origin (server-to-server), allow
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    console.warn('[CORS] Preflight denied for origin:', origin);
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', String(corsOptions.maxAge || 3600));

  return res.status(204).end();
});

// ──────────────────────────────────────────────────────
// Body Parsing
// ──────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// ──────────────────────────────────────────────────────
// Serve Uploaded Files
// ──────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ──────────────────────────────────────────────────────
// Global Rate Limiter
// ──────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production';

console.log('NODE_ENV:', process.env.NODE_ENV);

if (isProduction) {
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: errorResponse('Too many requests, please try again later.'),
  });

  app.use(globalLimiter);
  logger.info('Global rate limiter enabled in production.');
} else {
  logger.info('Global rate limiter disabled outside production.');
}

// ──────────────────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ──────────────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ──────────────────────────────────────────────────────
// Serve Frontend Static Files
// ──────────────────────────────────────────────────────
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// ──────────────────────────────────────────────────────
// SPA Catch-all: Serve index.html for all non-API routes
// ──────────────────────────────────────────────────────
app.use((req: Request, res: Response, next: NextFunction) => {
  // Skip API routes - let them fall through to 404 handler
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve index.html for all other routes (SPA routing)
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json(errorResponse('Frontend not found. Please build the frontend.'));
    }
  });
});

// ──────────────────────────────────────────────────────
// Global Error Handler
// ──────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);

  if (err.name === 'ZodError') {
    logger.warn('Validation Error Details:', JSON.stringify(err.errors, null, 2));
    return res.status(422).json({
      success: false,
      message: err.message || 'Validation failed',
      errors: err.errors || [],
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json(errorResponse(`${field} already exists`));
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json(errorResponse('Invalid or expired token'));
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json(errorResponse(message));
});

export default app;