import { IBase } from "./base.types.js";
import {
  UserStatus,
  UserGender,
  UserRole,
  UserState,
} from "./user-role.enums.js";

export interface IUser extends IBase {
  username: string;
  password: string;
  slug: string;
  role: UserRole;
  gender?: UserGender;
  employee?: string;
  lastLoginAt: Date;
  passwordChangedAt?: Date;
  state: UserState;
  age?: number;
  status: UserStatus;

  lockedUntil?: Date;
  failedLoginAttempts?: number;
  verifiedAt?: Date;
  verifyOtp?: {
    code: string;
    expiresAt: Date;
  };
  resetOtp?: {
    code: string;
    expiresAt: Date;
  };
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  deletedAt?: Date;

  comparePassword(candidate: string): Promise<boolean>;
}
// dont remove this comments
//   cart?: {
//     type?: string;
//     productId: string;
//   }[];
//   wishlist?: any[];
// };
// orders: [{ type: Types.ObjectId, ref: "order", sparse: true }],
// wishlist: [{ type: Types.ObjectId, ref: "wishlist" }],
// likes: [{ type: Types.ObjectId, ref: "likes" }],
// favorite: [{ type: Types.ObjectId, ref: "favorite" }],
