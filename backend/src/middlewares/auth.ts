import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { errorResponse } from '../utils/responseFormat';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Debug: show presence of cookies and origin (no token values)
  try {
    console.debug('[Auth Debug] Origin:', (req.headers.origin as string | undefined) || '(none)', 'Cookie keys:', Object.keys(req.cookies || {}).join(', '));
  } catch (e) {
    // ignore
  }

  // 1. Try to get token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Try to get token from cookie if header is missing
  if (!token) {
    token = req.cookies['2CaRvN_at'];
  }

  if (!token) {
    console.warn(`[Auth] No token provided for: ${req.method} ${req.url}`);
    return res.status(401).json(errorResponse('Unauthorized: Missing or invalid token'));
  }

  console.debug(`[Auth] Verifying token for: ${req.method} ${req.url}`);
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    console.warn(`[Auth] Failed to decode token for: ${req.method} ${req.url}`);
    return res.status(401).json(errorResponse('Unauthorized: Invalid or expired token'));
  }

  console.debug(`[Auth] User authenticated: ${decoded.userId} (${decoded.role})`);
  req.user = decoded;
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(errorResponse('Unauthorized'));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(errorResponse('Forbidden: Insufficient role permissions'));
    }

    next();
  };
};

export const requireAccessLevel = (levels: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(errorResponse('Unauthorized'));
    }

    // ✅ teacher and Admins bypass access level restrictions
    if (['admin', 'teacher', 'staff'].includes(req.user.role)) {
      return next();
    }

    if (!levels.includes(req.user.accessLevel)) {
      console.warn(`[Auth] Access Denied: User ${req.user.userId} has level "${req.user.accessLevel}", but required is one of [${levels.join(', ')}]`);
      return res.status(403).json(errorResponse('Forbidden: Insufficient access level'));
    }

    next();
  };
};
