import { EmpJobRole, EMP_ROLE } from "@/domain/types/employee.types";
import {
  TPermission,
  TUserRole,
  USER_PERMISSION,
  USER_ROLE,
} from "@/domain/types/user.types";

const ALL_PERMISSIONS: TPermission[] = [...USER_PERMISSION];

export const defaultRolePermissions: Record<TUserRole, TPermission[]> = {
  customer: ["product:read", "order:create", "order:read_own"],
  employee: [
    "product:read",
    "product:create",
    "product:update",
    "product:delete",
    "inventory:read",
    "inventory:stock_in",
    "inventory:stock_out",
    "inventory:transfer",
    "inventory:adjust",
    "supplier:read",
    "brand:read",
    "employee:read",
  ],
  supplier: [
    "product:read",
    "inventory:read",
    "inventory:stock_in",
    "supplier:read",
  ],
};

/**
 * Job-role permissions for staff (`USER_ROLE = employee`).
 * `admin` gets the full permission set.
 */
export const defaultJobRolePermissions: Record<EmpJobRole, TPermission[]> = {
  admin: ALL_PERMISSIONS,
  manager: [
    "product:read",
    "product:create",
    "product:update",
    "product:delete",
    "inventory:read",
    "inventory:stock_in",
    "inventory:stock_out",
    "inventory:transfer",
    "inventory:adjust",
    "order:read",
    "order:create",
    "order:update",
    "supplier:read",
    "supplier:create",
    "supplier:update",
    "brand:read",
    "brand:create",
    "brand:update",
    "employee:read",
    "employee:create",
    "employee:update",
    "customer:read",
    "customer:update",
  ],
  warehouseManager: [
    "product:read",
    "inventory:read",
    "inventory:stock_in",
    "inventory:stock_out",
    "inventory:transfer",
    "inventory:adjust",
    "supplier:read",
    "brand:read",
    "employee:read",
  ],
  sales: [
    "product:read",
    "order:create",
    "order:read",
    "order:update",
    "customer:read",
    "customer:update",
    "brand:read",
    "inventory:read",
    "employee:read",
  ],
  accountant: [
    "product:read",
    "order:read",
    "inventory:read",
    "supplier:read",
    "customer:read",
    "brand:read",
    "employee:read",
  ],
};

export const permissionsForUserRole = (role: TUserRole): TPermission[] => [
  ...defaultRolePermissions[role],
];

export const permissionsForJobRole = (jobRole: EmpJobRole): TPermission[] => [
  ...defaultJobRolePermissions[jobRole],
];

const isUserRole = (role: string): role is TUserRole =>
  (USER_ROLE as readonly string[]).includes(role);

const isJobRole = (role: string): role is EmpJobRole =>
  (EMP_ROLE as readonly string[]).includes(role);

export interface ResolvedAccess {
  role: TUserRole;
  permissions: TPermission[];
}

/**
 * Single source of truth for access.
 * - `admin` written in Compass is normalized to `employee` + admin permissions.
 * - Staff with a jobRole use job-role permissions; otherwise role defaults.
 */
export const resolveAccess = (input: {
  role: string;
  jobRole?: string | null;
}): ResolvedAccess => {
  // Compass shortcut: people often set role="admin" directly.
  if (input.role === "admin" || input.jobRole === "admin") {
    return {
      role: "employee",
      permissions: permissionsForJobRole("admin"),
    };
  }

  const role: TUserRole = isUserRole(input.role) ? input.role : "customer";

  if (role === "employee" && input.jobRole && isJobRole(input.jobRole)) {
    return {
      role,
      permissions: permissionsForJobRole(input.jobRole),
    };
  }

  return {
    role,
    permissions: permissionsForUserRole(role),
  };
};

export const samePermissions = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((value, index) => value === right[index]);
};
