import { IBaseArchived, IBaseStatus } from "@/types";
import { getStatus } from "@/common/generator/transitions";

export const USER_STATUS_TRANSITIONS = {
  active: ["blocked"],
  blocked: ["active"],
} as const;

export const USER_STATUS = getStatus(USER_STATUS_TRANSITIONS);
export type TUserStatus = (typeof USER_STATUS)[number];
export const USER_ROLE = ["customer", "employee", "supplier"] as const;
export type TUserRole = (typeof USER_ROLE)[number];

export const USER_PERMISSION = [
  "product:read",
  "product:create",
  "product:update",
  "product:delete",
  "inventory:read",
  "inventory:stock_in",
  "inventory:stock_out",
  "inventory:transfer",
  "inventory:adjust",
  "order:create",
  "order:read_own",
  "supplier:read",
] as const;
export type TPermission = (typeof USER_PERMISSION)[number];

// ===== Fields Interface =====
export interface IUserFields {
  username: string;
  email: string;
  password: string;
  role: TUserRole;
  permissions: TPermission[];
  slug?: string;
  passwordChangedAt?: Date;
}

// ===== Entity Data Interface =====
export interface IUser
  extends IUserFields, IBaseStatus<TUserStatus>, IBaseArchived {}
