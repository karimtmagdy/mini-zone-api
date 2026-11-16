import { TPermission, TUserRole } from "@/domain/types/user.types";

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
  ],
  supplier: [
    "product:read",
    "inventory:read",
    "inventory:stock_in",
    "supplier:read",
  ],
};
