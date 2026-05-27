export const PERSON_STATE = ["online", "offline"] as const;
export const PERSON_GENDERS = ["male", "female"] as const;
export const PERSON_STATUS = [
  "active",
  "inactive",
  "suspended",
  "banned",
  "pending",
  "verified",
  "archived",
  "deactivated",
  "locked",
  "on-leave",
  "terminated",
] as const;

export type PersonState = (typeof PERSON_STATE)[number];
export type PersonGender = (typeof PERSON_GENDERS)[number];
export type PersonStatus = (typeof PERSON_STATUS)[number];

export enum PErsonStateEnum {
  ONLINE = "online",
  OFFLINE = "offline",
}
export enum PersonGenderEnum {
  MALE = "male",
  FEMALE = "female",
}
export enum PersonStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  BANNED = "banned",
  PENDING = "pending",
  VERIFIED = "verified",
  ARCHIVED = "archived",
  DEACTIVATED = "deactivated",
  LOCKED = "locked",
  ON_LEAVE = "on-leave",
  TERMINATED = "terminated",
}
import { UserRole } from "./user.types";

export type IPerson = {
  id?: string;
  username: string;
  email: string;
  slug?: string;

  role?: UserRole;
  remember: boolean;
  password?: string;
  image?: {
    url: string | null;
    publicId: string | null;
  };
  status?: PersonStatus;
  state?: PersonState;
  gender?: PersonGender;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  failedLoginAttempts: number;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  activeAt?: Date;
  logoutAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
  deletedBy?: string;
  updatedBy?: string;
};

// export type IPerson = {
//   // _id?: string;
//   id?: string;
//   username: string;
//   slug: string;
//   email: string;
//   password?: string;
//   comparePassword(candidatePassword: string): Promise<boolean>;
//   name: {
//     first: string;
//     last: string;
//   };
//   age: number;
//   phone?: string;

//   image: ImageDto;
//   role: UserRole;

//   activeAt: Date;
//   logoutAt: Date;
//   lockedUntil: Date;
//   failedLoginAttempts: number;
//   passwordChangedAt?: Date;
//   verifiedAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt?: Date;
//   verifyOtp?: {
//     code: string;
//     expiresAt: Date;
//   } | null;
//   resetOtp?: {
//     code: string;
//     expiresAt: Date;
//   } | null;
//   twoFactorEnabled: boolean;
//   twoFactorSecret?: string;
//   remember: boolean;
// };

// export interface UserDto extends IPerson {
//   employeeId?: string;
// }
