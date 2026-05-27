import { AbstractPerson } from "./abstract.person.js";
import { IUser } from "../interface/user.types.js";
import { UserRole } from "../interface/enums/user-enum.types.js";

export class User extends AbstractPerson<IUser> {
  // Properties unique to User
  role: UserRole;
  employee: string | undefined;
  password: string;

  get username(): string {
    return this._doc.username;
  }

  // Security (OTP & 2FA)
  verifyOtp: { code: string; expiresAt: Date } | undefined;
  resetOtp: { code: string; expiresAt: Date } | undefined;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | undefined;

  constructor(doc: IUser) {
    super(doc);
    this.role = doc.role;
    this.employee = doc.employee;
    this.password = doc.password;

    this.verifyOtp = doc.verifyOtp;
    this.resetOtp = doc.resetOtp;
    this.twoFactorEnabled = doc.twoFactorEnabled;
    this.twoFactorSecret = doc.twoFactorSecret;
  }

  async comparePassword(candidate: string): Promise<boolean> {
    // This is typically handled by the model/repo, but left as a placeholder
    return false;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      role: this.role,
      image: this.image,
      status: this.status,
      state: this.state,
      employee: this.employee,
      lastLoginAt: this.lastLoginAt,
      slug: this.slug,
    };
  }
}
