import { ImageDto } from "@/validation/rules/shard.schema";

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

export type PersonDto = {
  id: string;
  username: string;
  slug: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  name: {
    first: string;
    last: string;
  };
  age: number;
  gender: UserGender;
  image: ImageDto;
  role: UserRole;
  status: UserStatus;
  state: UserState;
  activeAt: Date;
  logoutAt: Date;
  lockedUntil: Date;
  failedLoginAttempts: number;
  passwordChangedAt?: Date;
  verifiedAt?: Date;
  verifyOtp?: {
    code: string;
    expiresAt: Date;
  } | null;
  resetOtp?: {
    code: string;
    expiresAt: Date;
  } | null;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  remember: boolean;
  //   cart?: {
  //     type?: string;
  //     productId: string;
  //   }[];
  //   wishlist?: any[];
};
// orders: [{ type: Types.ObjectId, ref: "order", sparse: true }],
// wishlist: [{ type: Types.ObjectId, ref: "wishlist" }],
// likes: [{ type: Types.ObjectId, ref: "likes" }],
// favorite: [{ type: Types.ObjectId, ref: "favorite" }],
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
export enum UserStateEnum {
  ONLINE = "online",
  OFFLINE = "offline",
}
export enum UserGenderEnum {
  MALE = "male",
  FEMALE = "female",
}
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
