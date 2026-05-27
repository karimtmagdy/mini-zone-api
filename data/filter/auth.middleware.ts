import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt';
import { getRolePermissions, isValidRole } from '../config/rbac';

/**
 * authenticate — verifies JWT access token and attaches req.user.
 * Must be applied before any permission middleware.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Missing or malformed authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      res.status(401).json({ success: false, message: 'Invalid token type' });
      return;
    }

    if (!isValidRole(payload.role)) {
      res.status(401).json({ success: false, message: 'Invalid role in token' });
      return;
    }

    req.user = {
      id:          payload.sub,
      email:       payload.email,
      role:        payload.role,
      permissions: getRolePermissions(payload.role),
    };

    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
