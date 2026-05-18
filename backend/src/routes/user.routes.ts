import { Router } from 'express';
import { getProfile, updateProfile, getUserStats } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateProfileSchema } from '../validators/auth.validator';

const router = Router();

// All routes require a valid JWT access token
router.use(requireAuth);

/**
 * GET /api/v1/user/profile
 * Returns the authenticated user's profile (excludes password, soft-delete fields)
 */
router.get('/profile', getProfile);

/**
 * GET /api/v1/user/stats
 * Returns live performance stats for the authenticated user
 */
router.get('/stats', getUserStats);

/**
 * PATCH /api/v1/user/update
 * Updates the authenticated user's own profile
 * Validates: name only — role/email changes not permitted here
 */
router.patch('/update', validate(updateProfileSchema), updateProfile);

export default router;
