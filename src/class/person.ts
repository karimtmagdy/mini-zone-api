/**
 * AbstractPerson — base class for all human entities in the system.
 * Enforces shared fields and contracts across Employee and User.
 */
export abstract class AbstractPerson {
  abstract id: string;
  abstract username: string;
  abstract name: {
    first: string;
    last: string;
  };
  abstract email: string;
  abstract phone?: string;
  abstract createdAt: Date;
  abstract updatedAt: Date;

  get fullName(): string {
    return `${this.name.first} ${this.name.last}`;
  }

  abstract toJSON(): Record<string, unknown>;
}
