import { z } from 'zod';
import { Role, Permission, ROLE_PERMISSIONS } from '../../config/rbac';

// ─── Schema ────────────────────────────────────────────────────────────────

export const RoleQuerySchema = z.object({
  role: z.nativeEnum(Role).optional(),
});

// ─── Service ───────────────────────────────────────────────────────────────

import { AbstractGuardedService } from '../../shared/guard.service';
import { AuthUser }               from '../../types/auth.types';

export class RoleService extends AbstractGuardedService {
  getAllRoles(actor: AuthUser): Record<string, Permission[]> {
    this.assertPermission(actor, Permission.ROLE_READ);
    return ROLE_PERMISSIONS;
  }

  getRolePermissions(role: Role, actor: AuthUser): Permission[] {
    this.assertPermission(actor, Permission.ROLE_READ);
    return ROLE_PERMISSIONS[role];
  }
}

// ─── Controller ────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';

export class RoleController {
  constructor(private readonly service: RoleService) {}

  getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const roles = this.service.getAllRoles(req.user!);
      res.json({ success: true, data: roles });
    } catch (err) { next(err); }
  };

  getOne = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const role = req.params.role as Role;
      const permissions = this.service.getRolePermissions(role, req.user!);
      res.json({ success: true, data: { role, permissions } });
    } catch (err) { next(err); }
  };
}

// ─── Routes ────────────────────────────────────────────────────────────────

import { Router }            from 'express';
import { authenticate }      from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';

const service    = new RoleService();
const controller = new RoleController(service);

export const roleRouter = Router();

roleRouter.use(authenticate);

roleRouter.get(
  '/',
  requirePermission(Permission.ROLE_READ),
  controller.getAll
);

roleRouter.get(
  '/:role',
  requirePermission(Permission.ROLE_READ),
  controller.getOne
);
