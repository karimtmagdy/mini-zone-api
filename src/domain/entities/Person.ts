import {
  PersonStatus,
  PersonState,
  PersonGender,
} from "@/domain/types/person.types";
import { ImageDto } from "@/shared/schema/shard.schema";
import { UserRole } from "../types/user.types";

export abstract class Person {
  public id?: string;
  public username!: string;
  public email!: string;
  public slug?: string;
  public password?: string;
  public role?: UserRole;
  public status?: PersonStatus;
  public state?: PersonState;
  public gender?: PersonGender;
  public image?: ImageDto;
  public twoFactorEnabled: boolean = false;
  public lockedUntil?: Date;
  public failedLoginAttempts: number = 0;
  public lastLoginAt?: Date;
  public activeAt?: Date;
  public logoutAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public remember: boolean = false;
  public deletedAt: Date | null = null;

  constructor(data: Partial<Person>) {
    Object.assign(this, data);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
