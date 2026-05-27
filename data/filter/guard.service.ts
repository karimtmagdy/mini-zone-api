import { AuthUser } from '../types/auth.types';
import { Permission, hasPermission, hasAllPermissions } from '../config/rbac';

export class PermissionDeniedError extends Error {
  readonly statusCode = 403;
  constructor(permission: string) {
    super(`Access denied: missing permission '${permission}'`);
    this.name = 'PermissionDeniedError';
  }
}

/**
 * AbstractGuardedService — base for all services that require permission checks.
 * Call this.assertPermission() at the top of any sensitive method.
 */
export abstract class AbstractGuardedService {
  protected assertPermission(actor: AuthUser, required: Permission): void {
    if (!hasPermission(actor.role, required)) {
      throw new PermissionDeniedError(required);
    }
  }

  protected assertAllPermissions(actor: AuthUser, required: Permission[]): void {
    if (!hasAllPermissions(actor.role, required)) {
      throw new PermissionDeniedError(required.join(', '));
    }
  }

  protected assertSelfOrPermission(
    actor: AuthUser,
    targetId: string,
    required: Permission
  ): void {
    if (actor.id === targetId) return; // self-access always allowed
    this.assertPermission(actor, required);
  }
}
