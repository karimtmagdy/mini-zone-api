import { Document } from "mongoose";
import { IBaseDate, Image } from "./global.types.js";
import { UserGender, UserStatus, UserState } from "./enums/user-enum.types.js";

export interface IBase extends Document, IBaseDate {
  id: string;
}

export interface IPerson extends IBase {
  username: string;
  email: string;
  phone?: string;
  image: Image;
  age?: number;
  gender?: UserGender;
  status: UserStatus;
  state: UserState;
  lastLoginAt: Date;
  passwordChangedAt?: Date;
  deletedAt?: Date;
  lockedUntil?: Date;
  failedLoginAttempts?: number;
  verifiedAt?: Date;
  slug: string;
}
