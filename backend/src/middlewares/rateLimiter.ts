import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';

const isProduction = process.env.NODE_ENV === 'production';

logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(
  `Rate Limiter Mode: ${
    isProduction ? 'ENABLED (Production)' : 'DISABLED (Development)'
  }`
);

const disableLimiter = (_req: any, _res: any, next: any) => {
  next();
};

export const authLimiter = isProduction
  ? rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: errorResponse(
        'Too many authentication attempts, please try again later.'
      ) as any,
    })
  : disableLimiter;

export const examLimiter = isProduction
  ? rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: errorResponse(
        'Too many exam submissions, please try again later.'
      ) as any,
    })
  : disableLimiter;

export const applicationLimiter = isProduction
  ? rateLimit({
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      max: 3,
      standardHeaders: true,
      legacyHeaders: false,
      message: errorResponse(
        'You can only submit 3 applications per day.'
      ) as any,
    })
  : disableLimiter;
