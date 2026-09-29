import { IBaseMetaData } from "@/types";
import { HydratedDocument } from "mongoose";

export const USER_STATUS = ["active", "blocked"] as const;
export type TUserStatus = (typeof USER_STATUS)[number];
export const USER_ROLE = ["customer", "employee", "supplier"] as const;
export type TUserRole = (typeof USER_ROLE)[number];

export const USER_PERMISSION = [
  "product.read",
  "product.create",
  "product.update",
  "product.delete",
  "inventory.read",
  "inventory.stock_in",
  "inventory.stock_out",
  "inventory.transfer",
  "inventory.adjust",
  "order.create",
  "order.read_own",
  "supplier.read",
] as const;
export type TPermission = (typeof USER_PERMISSION)[number];

export type TUserDoc = HydratedDocument<IUser>;
export interface IUser extends IBaseMetaData {
  username: string;
  email: string;
  password: string;
  role: TUserRole;
  permissions: TPermission[];
  status: TUserStatus;
  slug: string;
  passwordChangedAt: Date;
}
