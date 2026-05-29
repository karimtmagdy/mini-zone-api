import { UserDto } from "@/_R/user.types";
import { AbstractPerson } from "./person.abstract";

export class User extends AbstractPerson<UserDto> {
  public employeeId?: string;

  constructor(doc: UserDto) {
    super(doc);
    this.employeeId = doc.employeeId;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      username: this.username || "n/a",
      email: this.email,
      phone: this.phone,
      image: this.image,
      role: this._doc.role,
      status: this.status,
      state: this.state,
      employeeId: this.employeeId,
      createdAt: this.createdAt,
    };
  }
}
