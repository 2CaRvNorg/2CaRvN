import { Router } from 'express';
import {
  submitApplication,
  getApplicationStatus,
} from '../controllers/application.controller';
import { requireAuth, requireAccessLevel } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { applicationSchema } from '../validators/application.validator';
import { applicationLimiter } from '../middlewares/rateLimiter';

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * POST /api/v1/application
 * Submit a new application.
 * Requires: JWT auth + registered/subscribed access level + Zod validation + rate limiter
 */
router.post(
  '/',
  requireAccessLevel(['registered', 'subscribed']),
  applicationLimiter,
  validate(applicationSchema),
  submitApplication
);

/**
 * GET /api/v1/application/status
 * Get the authenticated user's application status
 */
router.get('/status', getApplicationStatus);

export default router;
