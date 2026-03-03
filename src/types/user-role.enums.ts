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
export const USER_STATE = ["online", "offline"] as const;
export type UserState = (typeof USER_STATE)[number];
export enum UserStateEnum {
  ONLINE = "online",
  OFFLINE = "offline",
}
export const USER_GENDERS = ["male", "female"] as const;
export type UserGender = (typeof USER_GENDERS)[number];
export enum UserGenderEnum {
  MALE = "male",
  FEMALE = "female",
}
export const USER_STATUS = [
  "active",
  "inactive",
  "suspended",
  "banned",
  "pending",
  "verified",
  "archived",
  "deactivated",
  "locked",
] as const;
export type UserStatus = (typeof USER_STATUS)[number];
export enum UserStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  BANNED = "banned",
  PENDING = "pending",
  VERIFIED = "verified",
  ARCHIVED = "archived",
  DEACTIVATED = "deactivated",
  LOCKED = "locked",
}
