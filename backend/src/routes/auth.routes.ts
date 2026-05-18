import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  verifyOtp,
  googleLogin,
  githubOAuthRedirect,
  oauthCallback,
} from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema, verifyOtpSchema, googleLoginSchema } from '../validators/auth.validator';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Public — rate limited to 10 requests/15min per IP
 * Validates: name, email (email format), password (strength requirements)
 */
router.post('/register', authLimiter, validate(registerSchema), register);

/**
 * POST /api/v1/auth/login
 * Public — rate limited
 * Validates: email, password
 */
router.post('/login', authLimiter, validate(loginSchema), login);

/**
 * POST /api/v1/auth/login/verify-otp
 * Public — verifies OTP code and returns authentication cookies
 */
router.post('/login/verify-otp', authLimiter, validate(verifyOtpSchema), verifyOtp);

/**
 * POST /api/v1/auth/google
 * Public — verifies Google ID token from the frontend and issues JWT cookies.
 */
router.post('/google', authLimiter, validate(googleLoginSchema), googleLogin);

/**
 * GET /api/v1/auth/oauth/github
 * Redirects to GitHub OAuth consent page.
 */
router.get('/oauth/github', githubOAuthRedirect);

/**
 * GET /api/v1/auth/oauth/callback
 * Handles OAuth provider callback and issues cookies.
 */
router.get('/oauth/callback', oauthCallback);

/**
 * POST /api/v1/auth/refresh
 * Public — reads httpOnly refresh cookie, returns new access token
 * Rate limited to prevent token rotation abuse
 */
router.post('/refresh', authLimiter, refresh);

/**
 * POST /api/v1/auth/logout
 * Public — clears the refresh token cookie
 */
router.post('/logout', logout);

export default router;