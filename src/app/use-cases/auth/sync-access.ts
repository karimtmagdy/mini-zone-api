import {
  resolveAccess,
  samePermissions,
} from "@/common/rule/role-permission";
import { CustomerEntity } from "@/domain/entities/customer.entity";
import { IAuthImpl } from "@/domain/interfaces/auth.repo.impl";
import { IEmployeeImpl } from "@/domain/interfaces/employee.repo.impl";

/**
 * Recomputes role/permissions from the role rules (+ employee jobRole).
 * Persists when Compass/manual edits drifted from the rule map.
 */
export const syncUserAccess = async (
  user: CustomerEntity,
  authRepo: IAuthImpl,
  employeeRepo: IEmployeeImpl,
): Promise<CustomerEntity> => {
  const employee = await employeeRepo.findByUserId(user.id);
  const resolved = resolveAccess({
    role: user.role,
    jobRole: employee?.jobRole,
  });

  const roleChanged = resolved.role !== user.role;
  const permissionsChanged = !samePermissions(
    user.permissions,
    resolved.permissions,
  );

  if (!roleChanged && !permissionsChanged) {
    return user;
  }

  const updated = await authRepo.updateAccess(user.id, resolved);
  return updated ?? user;
};
