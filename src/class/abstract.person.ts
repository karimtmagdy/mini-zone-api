import { UserGender, UserRole } from "../types/user-role.enums.js";
import { Image } from "../types/global.types.js";
import { IBase } from "../types/base.types.js";

/**
 * AbstractPerson — base class for all human entities in the system.
 * T represents the document type (IUser, IEmployee, etc.)
 */
export abstract class AbstractPerson<T extends IBase = IBase> {
  protected readonly _doc: T;

  constructor(doc: T) {
    this._doc = doc;
  }

  // Common getters to avoid redundant declarations in subclasses
  get id(): string { return this._doc.id; }
  get name() { return this._doc.name; }
  get email(): string { return this._doc.email; }
  get phone(): string | undefined { return this._doc.phone; }
  get createdAt(): Date { return this._doc.createdAt; }
  get updatedAt(): Date { return this._doc.updatedAt; }
  get image(): Image { return this._doc.image; }
  get fullName(): string {
    return `${this.name.first} ${this.name.last}`;
  }

  // Abstract methods that must be implemented based on specific logic
  abstract toJSON(): Record<string, unknown>;
}
