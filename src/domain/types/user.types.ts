import { PaginatedResult } from "@/types/global.dto";
import { User } from "../entities/User";
import { IPerson } from "./person.types";

export const USER_ROLES = [
  "user",
  "super-admin",
  "admin",
  "manager",
  "viewer",
  "seller",
  "delivery-boy",
  "staff",
  "customer-support",
  "vendor",
  "hr",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export enum UserRoleEnum {
  USER = "user",
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  MANAGER = "manager",
  VIEWER = "viewer",
  SELLER = "seller",
  DELIVERY_BOY = "delivery-boy",
  STAFF = "staff",
  CUSTOMER_SUPPORT = "customer-support",
  VENDOR = "vendor",
  HR = "hr",
}

export interface IUser extends IPerson {
  // employeeId?: any;
}
export interface UserRepoType {
  create(user: User, performerId?: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(
    id: string,
    user: Partial<User>,
    performerId?: string,
  ): Promise<User | null>;
  getAll(query: any): Promise<PaginatedResult<User>>;
  findDeleted(query: any): Promise<User>;
  softDelete(id: string, performerId?: string): Promise<User | null>;
  restore(id: string, performerId?: string): Promise<User | null>;
  deleteById(id: string): Promise<boolean>;
  bulkUpdate(
    ids: string[],
    data: Partial<User>,
    performerId?: string,
  ): Promise<number>;
  bulkDelete(ids: string[]): Promise<number>;
}
