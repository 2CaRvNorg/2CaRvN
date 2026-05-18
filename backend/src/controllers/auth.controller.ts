import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../models/User';
import { config } from '../config/env';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { logger } from '../utils/logger';
import { sendOtpEmail } from '../utils/email';
import { GoogleLoginInput } from '../validators/auth.validator';

const REFRESH_COOKIE_NAME = '2CaRvN_rt';
const ACCESS_COOKIE_NAME = '2CaRvN_at';

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,                                          // JS cannot read this cookie
  secure: isProduction,                                    // HTTPS only in prod
  sameSite: isProduction ? 'none' as const : 'lax' as const, // Cross-site support in prod
  path: '/',
};

const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const getRetryAfterSeconds = () => Math.ceil(LOCK_DURATION_MS / 1000);

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,                       // 7 days
};

const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 15 * 60 * 1000,                                 // 15 minutes
};

// ──────────────────────────────────────────────────────
// POST /auth/register
// ──────────────────────────────────────────────────────
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body; // Already validated by Zod proxy

    // ✅ FIX: Prevent duplicate accounts + check soft-deleted accounts
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      res.status(409).json(errorResponse('An account with this email already exists'));
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      accessLevel: 'registered', // Newly registered → can apply for subscription
    });

    const payload = {
      userId: (user._id as any).toString(),
      role: user.role,
      accessLevel: user.accessLevel,
      enrolledTrack: user.enrolledTrack || null,
      tokenVersion: user.tokenVersion ?? 0,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    res.status(201).json(
      successResponse(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessLevel: user.accessLevel,
            authProvider: user.authProvider,
            profilePicture: user.profilePicture,
            emailVerified: user.emailVerified,
            isVerified: user.emailVerified,
          },
        },
        'Account created successfully'
      )
    );
  } catch (error) {
    logger.error('Registration error:', error);
    next(error); // Passes to global error handler (handles Mongoose duplicate key etc.)
  }
};

// ──────────────────────────────────────────────────────
// POST /auth/login
// ──────────────────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false }).select('+password');
    const INVALID_MSG = 'Invalid email or password';

    if (!user) {
      res.status(401).json(errorResponse(INVALID_MSG));
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json(errorResponse('Your account has been suspended. Please contact support.'));
      return;
    }

    if (user.authProvider !== 'local' && user.authProvider !== 'manual') {
      const providerLabel = user.authProvider === 'google' ? 'Google' : 'GitHub';
      res.status(400).json(
        errorResponse(`This account uses ${providerLabel} login. Please sign in with ${providerLabel}`)
      );
      return;
    }

    const now = new Date();
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (!isDevelopment && user.lockUntil && user.lockUntil > now) {
      const retryAfter = getRetryAfterSeconds();
      res.status(423).json(
        errorResponse('Account locked. Try again in a few minutes.', {
          error: {
            code: 'ACCOUNT_LOCKED',
            retryAfter,
          },
        })
      );
      return;
    }

    // Clear expired lock state before password verification.
    if (user.lockUntil && user.lockUntil <= now) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      if (!isDevelopment) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;

        if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
          user.loginAttempts = 0;
          user.lockUntil = new Date(now.getTime() + LOCK_DURATION_MS);
          await user.save();

          res.status(423).json(
            errorResponse('Account locked due to too many failed login attempts.', {
              error: {
                code: 'ACCOUNT_LOCKED',
                retryAfter: getRetryAfterSeconds(),
              },
            })
          );
          return;
        }

        await user.save();
      }

      const attemptsRemaining = isDevelopment ? 'unlimited' : (MAX_LOGIN_ATTEMPTS - (user.loginAttempts || 0));
      res.status(401).json(
        errorResponse('Invalid password.', {
          attemptsRemaining,
        })
      );
      return;
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // ✅ Direct login — no OTP required. Issue tokens immediately.
    const payload = {
      userId: (user._id as any).toString(),
      role: user.role,
      accessLevel: user.accessLevel,
      enrolledTrack: user.enrolledTrack || null,
      tokenVersion: user.tokenVersion ?? 0,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    res.status(200).json(
      successResponse(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessLevel: user.accessLevel,
            authProvider: user.authProvider,
            profilePicture: user.profilePicture,
            emailVerified: user.emailVerified,
            isVerified: user.emailVerified,
          },
        },
        'Login successful'
      )
    );
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// POST /auth/login/verify-otp
// Verify one-time password and issue JWT cookies
// ──────────────────────────────────────────────────────
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otpCode } = req.body;
    const user = await User.findOne({ email, isDeleted: false }).select('+otpCode +otpExpiresAt');

    if (!user || user.status !== 'active' || !user.otpCode || !user.otpExpiresAt) {
      res.status(401).json(errorResponse('Invalid or expired verification code'));
      return;
    }

    if (user.otpCode !== otpCode || user.otpExpiresAt < new Date()) {
      res.status(401).json(errorResponse('Invalid or expired verification code'));
      return;
    }

    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    const payload = {
      userId: (user._id as any).toString(),
      role: user.role,
      accessLevel: user.accessLevel,
      enrolledTrack: user.enrolledTrack || null,
      tokenVersion: user.tokenVersion ?? 0,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    res.status(200).json(
      successResponse(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessLevel: user.accessLevel,
          },
          accessToken,
        },
        'Login successful'
      )
    );
  } catch (error) {
    logger.error('OTP verification error:', error);
    next(error);
  }
};

const buildProviderCallbackUrl = (callbackUrl?: string) => {
  if (!callbackUrl) {
    return config.frontendUrl || '/dashboard';
  }

  if (callbackUrl.startsWith('/')) {
    return `${config.frontendUrl}${callbackUrl}`;
  }

  if (config.frontendUrl && callbackUrl.startsWith(config.frontendUrl)) {
    return callbackUrl;
  }

  return config.frontendUrl || '/dashboard';
};

const getStateFromUrl = (callbackUrl?: string) => {
  if (!callbackUrl) return undefined;
  return Buffer.from(callbackUrl).toString('base64url');
};

const getUrlFromState = (state?: string) => {
  if (!state) return undefined;
  try {
    return Buffer.from(state, 'base64url').toString('utf-8');
  } catch {
    return undefined;
  }
};

const isManualAuthProvider = (authProvider?: string) => authProvider === 'manual' || authProvider === 'local';

const issueTokensForUser = async (user: IUser) => {
  const payload = {
    userId: (user._id as any).toString(),
    role: user.role,
    accessLevel: user.accessLevel,
    enrolledTrack: user.enrolledTrack || null,
    tokenVersion: user.tokenVersion ?? 0,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken, payload };
};

const redirectWithCookies = (
  res: Response,
  callbackUrl: string,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
  res.cookie(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);
  res.redirect(callbackUrl);
};

// ──────────────────────────────────────────────────────
// POST /auth/google
// ──────────────────────────────────────────────────────
export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('[Google Login] Request received');
    const payload = req.body as GoogleLoginInput;
    const { credential } = payload;
    console.log('[Google Login] Credential present:', !!credential);

    const client = new OAuth2Client(config.googleClientId);
    console.log('[Google Login] Verifying token with Google...');

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });

    const googlePayload = ticket.getPayload();
    console.log('[Google Login] Google payload received:', !!googlePayload);

    if (!googlePayload) {
      console.error('[Google Login] No payload from Google token verification');
      res.status(401).json(errorResponse('Unable to verify Google token'));
      return;
    }

    const email = googlePayload.email?.toLowerCase();
    const emailVerified = googlePayload.email_verified;
    const name = googlePayload.name || googlePayload.email || 'Student';
    const picture = googlePayload.picture || null;
    const googleId = googlePayload.sub;

    console.log('[Google Login] Extracted data:', {
      email: !!email,
      emailVerified,
      name: !!name,
      picture: !!picture,
      googleId: !!googleId
    });

    if (!email || !emailVerified || !googleId) {
      console.error('[Google Login] Missing required fields:', { email: !!email, emailVerified, googleId: !!googleId });
      res.status(400).json(errorResponse('Google account must provide a verified email'));
      return;
    }

    console.log('[Google Login] Looking for existing user with googleId...');
    let user = await User.findOne({ googleId, isDeleted: false });
    console.log('[Google Login] Found user by googleId:', !!user);

    console.log('[Google Login] Looking for existing user with email...');
    const manualMatch = await User.findOne({ email, isDeleted: false });
    console.log('[Google Login] Found user by email:', !!manualMatch);

    if (!user && manualMatch) {
      console.log('[Google Login] Handling account linking...');
      if (!isManualAuthProvider(manualMatch.authProvider) && manualMatch.authProvider !== 'google') {
        console.error('[Google Login] Auth provider conflict');
        res.status(409).json(
          errorResponse('An account already exists with this email using a different sign-in provider')
        );
        return;
      }

      if (manualMatch.googleId && manualMatch.googleId !== googleId) {
        console.error('[Google Login] Google ID conflict');
        res.status(409).json(errorResponse('Google account conflict detected for this email'));
        return;
      }

      console.log('[Google Login] Linking Google account to existing user');
      manualMatch.googleId = googleId;
      manualMatch.profilePicture = picture || manualMatch.profilePicture;
      manualMatch.emailVerified = true;
      if (manualMatch.authProvider !== 'google') {
        manualMatch.authProvider = 'manual';
      }
      await manualMatch.save();
      user = manualMatch;
    }

    if (!user) {
      console.log('[Google Login] Creating new user...');
      user = await User.create({
        name,
        email,
        authProvider: 'google',
        googleId,
        profilePicture: picture,
        emailVerified: true,
        role: 'student',
        accessLevel: 'registered',
      } as any);
      console.log('[Google Login] New user created:', user._id);
    } else {
      console.log('[Google Login] Using existing user:', user._id);
      if (user.status !== 'active') {
        console.error('[Google Login] User account suspended');
        res.status(403).json(errorResponse('This account has been suspended. Please contact support.'));
        return;
      }
      if (user.authProvider === 'google' && !user.googleId) {
        user.googleId = googleId;
      }
      user.name = name || user.name;
      user.profilePicture = picture || user.profilePicture;
      user.emailVerified = true;
      await user.save();
      console.log('[Google Login] User updated');
    }

    console.log('[Google Login] Issuing tokens...');
    const { accessToken, refreshToken } = await issueTokensForUser(user);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);

    console.log('[Google Login] Login successful, sending response');
    res.status(200).json(
      successResponse(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessLevel: user.accessLevel,
            authProvider: user.authProvider,
            profilePicture: user.profilePicture,
            emailVerified: user.emailVerified,
            isVerified: user.emailVerified,
          },
        },
        'Google login successful'
      )
    );
  } catch (error) {
    console.error('[Google Login] Error:', error);
    logger.error('Google login error:', error);
    next(error);
  }
};

const googleOAuthRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const callbackUrl = req.query.callbackUrl?.toString();
    const state = getStateFromUrl(callbackUrl);
    const qs = new URLSearchParams({
      client_id: config.googleClientId,
      redirect_uri: `${config.backendUrl}/api/v1/auth/oauth/callback?provider=google`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state || '',
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`);
  } catch (error) {
    logger.error('Google OAuth redirect error:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /auth/oauth/github
// ──────────────────────────────────────────────────────
export const githubOAuthRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const callbackUrl = req.query.callbackUrl?.toString();
    const state = getStateFromUrl(callbackUrl);
    const qs = new URLSearchParams({
      client_id: config.githubClientId,
      redirect_uri: `${config.backendUrl}/api/v1/auth/oauth/callback?provider=github`,
      scope: 'user:email',
      state: state || '',
    });

    res.redirect(`https://github.com/login/oauth/authorize?${qs.toString()}`);
  } catch (error) {
    logger.error('GitHub OAuth redirect error:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// GET /auth/oauth/callback
// Handles both Google and GitHub callbacks and issues cookies.
// ──────────────────────────────────────────────────────
export const oauthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state, provider } = req.query;
    if (!code || typeof code !== 'string') {
      res.status(400).json(errorResponse('OAuth code is required'));
      return;
    }

    const decodedState = getUrlFromState(typeof state === 'string' ? state : undefined);
    const redirectUrl = buildProviderCallbackUrl(decodedState);

    const googleTokenEndpoint = 'https://oauth2.googleapis.com/token';
    const githubTokenEndpoint = 'https://github.com/login/oauth/access_token';

    let oauthProvider: 'google' | 'github' | null = null;
    if (provider === 'google' || provider === 'github') {
      oauthProvider = provider;
    }
    if (!oauthProvider && config.googleClientId && config.googleClientSecret) {
      oauthProvider = 'google';
    }
    if (!oauthProvider && config.githubClientId && config.githubClientSecret) {
      oauthProvider = 'github';
    }

    let providerId: string | undefined;
    let name: string | undefined;
    let email: string | undefined;

    // Explicit hint from state may avoid inference issues: if callbackUrl contains google or github names it is not reliable.
    // Use a safe fallback to GitHub if Google exchange fails.

    if (oauthProvider === 'google') {
      const tokenResponse = await fetch(googleTokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: config.googleClientId,
          client_secret: config.googleClientSecret,
          redirect_uri: `${config.backendUrl}/api/v1/auth/oauth/callback`,
          grant_type: 'authorization_code',
        }),
      });

      const tokenResult = await tokenResponse.json();
      if (!tokenResult.access_token) {
        throw new Error('Google token exchange failed');
      }

      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResult.access_token}` },
      });
      const profile = await profileResponse.json();

      providerId = profile.sub;
      name = profile.name || profile.email;
      email = profile.email;
    }

    if (oauthProvider === 'github') {
      const tokenResponse = await fetch(githubTokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: config.githubClientId,
          client_secret: config.githubClientSecret,
          code,
          redirect_uri: `${config.backendUrl}/api/v1/auth/oauth/callback`,
        }),
      });

      const tokenResult = await tokenResponse.json();
      if (!tokenResult.access_token) {
        throw new Error('GitHub token exchange failed');
      }

      const profileResponse = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${tokenResult.access_token}` },
      });
      const profile = await profileResponse.json();

      let primaryEmail: string | undefined;
      if (profile.email) {
        primaryEmail = profile.email;
      } else {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: { Authorization: `token ${tokenResult.access_token}`, Accept: 'application/vnd.github+json' },
        });
        const emails = await emailResponse.json();
        const primary = Array.isArray(emails) ? emails.find((item: any) => item.primary && item.verified) : null;
        primaryEmail = primary?.email || emails?.[0]?.email;
      }

      providerId = profile.id?.toString();
      name = profile.name || profile.login;
      email = primaryEmail;
    }

    if (!email || !providerId || !name) {
      throw new Error('Unable to resolve OAuth user profile');
    }

    let user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      user = await User.create({
        name,
        email,
        authProvider: oauthProvider,
        providerId,
        role: 'student',
        accessLevel: 'registered',
      } as any);
    } else if (oauthProvider && user.authProvider !== oauthProvider && user.authProvider !== 'local') {
      user.authProvider = oauthProvider;
      user.providerId = providerId;
      await user.save();
    }

    if (user.status !== 'active') {
      res.status(403).json(errorResponse('Your account is suspended. Please contact support.'));
      return;
    }

    const { accessToken, refreshToken } = await issueTokensForUser(user as any);
    redirectWithCookies(res, redirectUrl, accessToken, refreshToken);
  } catch (error) {
    logger.error('OAuth callback error:', error);
    res.status(500).json(errorResponse('Social login failed. Please try again.'));
  }
};

// ──────────────────────────────────────────────────────
// POST /auth/refresh
// Refresh token rotation — issues new access + refresh pair
// ──────────────────────────────────────────────────────
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      res.status(401).json(errorResponse('No refresh token provided'));
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      // Clear the invalid/expired cookies
      res.clearCookie(REFRESH_COOKIE_NAME, { ...COOKIE_OPTIONS });
      res.clearCookie(ACCESS_COOKIE_NAME, { ...COOKIE_OPTIONS });
      res.status(403).json(errorResponse('Refresh token is invalid or expired. Please log in again.'));
      return;
    }

    // Verify the user still exists and is active
    const user = await User.findById(decoded.userId).select('_id role accessLevel status isDeleted tokenVersion');
    if (!user || user.isDeleted || user.status !== 'active') {
      res.clearCookie(REFRESH_COOKIE_NAME, { ...COOKIE_OPTIONS });
      res.clearCookie(ACCESS_COOKIE_NAME, { ...COOKIE_OPTIONS });
      res.status(403).json(errorResponse('User account not found or suspended'));
      return;
    }

    // Ensure tokenVersion matches (supports server side revocation)
    if ((decoded as any).tokenVersion !== (user as any).tokenVersion) {
      res.clearCookie(REFRESH_COOKIE_NAME, { ...COOKIE_OPTIONS });
      res.clearCookie(ACCESS_COOKIE_NAME, { ...COOKIE_OPTIONS });
      res.status(403).json(errorResponse('Refresh token has been revoked. Please log in again.'));
      return;
    }

    // Issue a fresh token pair (rotation)
    const payload = {
      userId: (user._id as any).toString(),
      role: user.role,
      accessLevel: user.accessLevel,
      enrolledTrack: user.enrolledTrack || null,
      tokenVersion: (user as any).tokenVersion ?? 0,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Rotate the refresh cookie and refresh access token cookie
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE_NAME, newAccessToken, ACCESS_COOKIE_OPTIONS);

    res.status(200).json(successResponse(null, 'Token refreshed'));
  } catch (error) {
    logger.error('Refresh token error:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────
// POST /auth/logout
// ──────────────────────────────────────────────────────
export const logout = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    // Attempt to revoke tokens by incrementing user's tokenVersion
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded && decoded.userId) {
        await User.findByIdAndUpdate(decoded.userId, { $inc: { tokenVersion: 1 } });
      }
    }

    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...COOKIE_OPTIONS,
    });
    res.clearCookie(ACCESS_COOKIE_NAME, {
      ...COOKIE_OPTIONS,
    });
    res.status(200).json(successResponse(null, 'Logged out successfully'));
  } catch (error) {
    logger.error('Logout error:', error);
    // Always clear cookie for safety even if revocation failed
    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...COOKIE_OPTIONS,
    });
    res.status(200).json(successResponse(null, 'Logged out'));
  }
};
