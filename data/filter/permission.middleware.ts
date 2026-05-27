import { Request, Response, NextFunction } from 'express';
import { Permission, hasPermission, hasAnyPermission } from '../config/rbac';

/**
 * requirePermission — middleware factory.
 * Checks that req.user holds the required permission.
 * Must be used AFTER authenticate middleware.
 *
 * @example
 * router.get('/', authenticate, requirePermission(Permission.EMPLOYEE_READ), ctrl.getAll)
 */
export const requirePermission =
  (permission: Permission) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated' });
      return;
    }

    if (!hasPermission(req.user.role, permission)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: requires '${permission}'`,
      });
      return;
    }

    next();
  };

/**
 * requireAnyPermission — passes if the user holds AT LEAST ONE of the listed permissions.
 */
export const requireAnyPermission =
  (permissions: Permission[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated' });
      return;
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${permissions.join(', ')}]`,
      });
      return;
    }

    next();
  };

/**
 * requireSelfOrPermission — allows access if the user is acting on their own record,
 * OR if they hold the required permission.
 */
export const requireSelfOrPermission =
  (permission: Permission, getTargetId: (req: Request) => string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated' });
      return;
    }

    const targetId = getTargetId(req);
    const isSelf   = req.user.id === targetId;

    if (isSelf || hasPermission(req.user.role, permission)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Forbidden: requires '${permission}' or ownership`,
    });
  };
