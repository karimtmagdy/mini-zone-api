import { AbstractPerson } from "./abstract.person.js";
import { IUser } from "../types/user.dto.js";

import {
  UserGender,
  UserRole,
  UserRoleEnum,
  UserStatus,
  UserState,
} from "../types/user-role.enums.js";

export class User extends AbstractPerson<IUser> {
  // Properties unique to User or that need explicit override
  username: string;
  role: UserRole;
  employee?: string | undefined;
  gender?: UserGender | undefined;
  slug: string;
  password: string;
  passwordChangedAt?: Date | undefined;
  status: UserStatus;
  state: UserState;
  age?: number | undefined;

  lockedUntil?: Date | undefined;
  failedLoginAttempts?: number | undefined;
  verifiedAt?: Date | undefined;
  verifyOtp?: { code: string; expiresAt: Date } | undefined;
  resetOtp?: { code: string; expiresAt: Date } | undefined;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | undefined;
  deletedAt?: Date | undefined;

  constructor(doc: IUser) {
    super(doc);
    // Explicitly assign fields that are not in the base getters
    this.username = doc.username;
    this.role = doc.role;
    this.employee = doc.employee?.toString();
    this.gender = doc.gender;
    this.slug = doc.slug;
    this.password = doc.password;
    this.passwordChangedAt = doc.passwordChangedAt;
    this.status = doc.status;
    this.state = doc.state;
    this.age = doc.age;

    this.lockedUntil = doc.lockedUntil;
    this.failedLoginAttempts = doc.failedLoginAttempts;
    this.verifiedAt = doc.verifiedAt;
    this.verifyOtp = doc.verifyOtp;
    this.resetOtp = doc.resetOtp;
    this.twoFactorEnabled = doc.twoFactorEnabled;
    this.twoFactorSecret = doc.twoFactorSecret;
    this.deletedAt = doc.deletedAt;
  }

  // Getters for specific User properties if needed, or just use the ones above
  get lastLoginAt(): Date | undefined {
    return this._doc.lastLoginAt;
  }

  async comparePassword(candidate: string): Promise<boolean> {
    // Ideally this would use a static method on the model or be handled by the controller
    return false;
  }

  isAdmin(): boolean {
    return this.role === UserRoleEnum.ADMIN;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      image: this.image,
      status: this.status,
      state: this.state,
      employee: this.employee,
      lastLoginAt: this.lastLoginAt,
    };
  }

  get fullName(): string {
    return `${this.name.first} ${this.name.last}`;
  }
}
