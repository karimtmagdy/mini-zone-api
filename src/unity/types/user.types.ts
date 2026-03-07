export const USER_STATE = ["online", "offline"] as const;
export const USER_GENDERS = ["male", "female"] as const;
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
export type UserRole = (typeof USER_ROLES)[number];
export type UserState = (typeof USER_STATE)[number];
export type UserGender = (typeof USER_GENDERS)[number];
