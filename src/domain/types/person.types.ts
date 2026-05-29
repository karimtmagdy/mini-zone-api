import { IBaseImage, IBaseMetadata } from "@/types/global.dto";
import { UserRole } from "./user.types";

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

export interface IPerson extends IBaseMetadata, IBaseImage {
  id: string;
  username: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  slug: string;
  role: UserRole;
  remember: boolean;
  password: string;
  status: PersonStatus;
  state: PersonState;
  gender: PersonGender;
  adult: boolean;
  age: number;
  phone?: string;
  lockedUntil: Date;
  twoFactorEnabled: boolean;
  failedLoginAttempts: number;
  lastLoginAt: Date;
  passwordChangedAt: Date;
  activeAt: Date;
  logoutAt: Date;
  verifiedAt?: Date;
  
}

// export interface UserDto extends IPerson {
//   employeeId?: string;
// }
