import { AggregateRoot } from "@/common/lib/aggregate-root";
import {
  IUser,
  TUserStatus,
  TUserRole,
  TPermission,
  USER_STATUS_TRANSITIONS,
} from "../types/user.types";
import { TPersonGender } from "../types/person.types";

export class CustomerEntity extends AggregateRoot<
  TUserStatus,
  typeof USER_STATUS_TRANSITIONS
> {
  public username: string;
  public readonly email: string;
  public readonly password?: string;
  public role: TUserRole;
  public permissions: TPermission[];
  public readonly slug?: string;
  public readonly passwordChangedAt?: Date;
  // public age: number;
  // public gender: TPersonGender;
  public lockedUntil?: Date;
  public failedLoginAttempts: number;
  public lastLoginAt: Date;

  constructor(params: {
    id: string;
    data: IUser;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super({
      id: params.id,
      status: params.data.status,
      transitions: USER_STATUS_TRANSITIONS,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      isArchived: params.data.isArchived,
      archivedAt: params.data.archivedAt,
    });

    this.username = params.data.username;
    this.email = params.data.email;
    this.password = params.data.password;
    this.role = params.data.role;
    // this.age = params.data.age;
    // this.gender = params.data.gender;
    this.permissions = params.data.permissions;
    this.failedLoginAttempts = params.data.failedLoginAttempts;
    this.lastLoginAt = params.data.lastLoginAt;
    this.slug = params.data.slug;
    this.passwordChangedAt = params.data.passwordChangedAt;
    this.lockedUntil = params.data.lockedUntil;
  }
  isLocked(): boolean {
    return !!this.lockedUntil && this.lockedUntil > new Date();
  }
}
