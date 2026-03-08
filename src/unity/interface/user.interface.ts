import { Image } from "../core/global.dto";
import {
  UserGender,
  UserRole,
  UserState,
  UserStatus,
} from "../types/user.types";

export type UserDto = {
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
  image: Image;
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
