// ─── Permissions ───────────────────────────────────────────────────────────
// Convention: resource:action

export enum Permission {
  // Employee
  EMPLOYEE_CREATE = 'employee:create',
  EMPLOYEE_READ   = 'employee:read',
  EMPLOYEE_UPDATE = 'employee:update',
  EMPLOYEE_DELETE = 'employee:delete',

  // User
  USER_CREATE = 'user:create',
  USER_READ   = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Notification
  NOTIFICATION_CREATE = 'notification:create',
  NOTIFICATION_READ   = 'notification:read',
  NOTIFICATION_MANAGE = 'notification:manage',

  // Role
  ROLE_READ   = 'role:read',
  ROLE_ASSIGN = 'role:assign',
}

// ─── Roles ─────────────────────────────────────────────────────────────────

export enum Role {
  ADMIN   = 'admin',
  MANAGER = 'manager',
  HR      = 'hr',
  VIEWER  = 'viewer',
}

// ─── Role → Permission Map ─────────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // wildcard — all permissions

  [Role.MANAGER]: [
    Permission.EMPLOYEE_CREATE,
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_UPDATE,
    Permission.EMPLOYEE_DELETE,
    Permission.NOTIFICATION_CREATE,
    Permission.NOTIFICATION_READ,
    Permission.NOTIFICATION_MANAGE,
    Permission.USER_READ,
    Permission.ROLE_READ,
  ],

  [Role.HR]: [
    Permission.EMPLOYEE_CREATE,
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_UPDATE,
    Permission.EMPLOYEE_DELETE,
    Permission.USER_READ,
  ],

  [Role.VIEWER]: [
    Permission.EMPLOYEE_READ,
    Permission.USER_READ,
    Permission.NOTIFICATION_READ,
    Permission.ROLE_READ,
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

export const getRolePermissions = (role: Role): Permission[] =>
  ROLE_PERMISSIONS[role] ?? [];

export const hasPermission = (role: Role, required: Permission): boolean =>
  ROLE_PERMISSIONS[role]?.includes(required) ?? false;

export const hasAllPermissions = (role: Role, required: Permission[]): boolean =>
  required.every(p => hasPermission(role, p));

export const hasAnyPermission = (role: Role, required: Permission[]): boolean =>
  required.some(p => hasPermission(role, p));

export const isValidRole = (role: string): role is Role =>
  Object.values(Role).includes(role as Role);
