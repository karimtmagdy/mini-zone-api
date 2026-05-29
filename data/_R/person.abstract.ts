import { IPerson, UserGender, UserStatus, UserState } from "@/_R/user.types";
import { ImageDto } from "@/shared/schema/shard.schema";

/**
 * AbstractPerson — base class for all human entities in the system.
 * T represents the document type (UserDto, EmployeeDto, etc.)
 */
export abstract class AbstractPerson<T extends IPerson = IPerson> {
  protected readonly _doc: T;

  constructor(doc: T) {
    this._doc = doc;
  }

  // Common getters to avoid redundant declarations in subclasses
  get id(): string {
    return this._doc.id;
  }
  get email(): string {
    return this._doc.email;
  }
  get username(): string {
    return this._doc.username;
  }
  get phone(): string | undefined {
    return this._doc.phone;
  }
  get createdAt(): Date {
    return this._doc.createdAt;
  }
  get updatedAt(): Date {
    return this._doc.updatedAt;
  }
  get image(): ImageDto {
    return this._doc.image;
  }

  // Shared personal & account state getters
  get age(): number {
    return this._doc.age;
  }
  get gender(): UserGender {
    return this._doc.gender;
  }
  get status(): UserStatus {
    return this._doc.status;
  }
  get state(): UserState {
    return this._doc.state;
  }
  get slug(): string {
    return this._doc.slug;
  }
  get passwordChangedAt(): Date | undefined {
    return this._doc.passwordChangedAt;
  }
  get deletedAt(): Date | undefined {
    return this._doc.deletedAt;
  }

  // Security & Verification getters
  get lockedUntil(): Date | undefined {
    return this._doc.lockedUntil;
  }
  get failedLoginAttempts(): number {
    return this._doc.failedLoginAttempts;
  }
  get verifiedAt(): Date | undefined {
    return this._doc.verifiedAt;
  }

  // Abstract methods that must be implemented based on specific logic
  abstract toJSON(): Record<string, unknown>;
}
// get lastLoginAt(): Date {
//     return this._doc.lastLoginAt;
//   }
