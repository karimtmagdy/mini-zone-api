import { UserModel } from "../models/user.model.js";
import { UserRole, UserStatusEnum } from "../types/user-role.enums.js";
import { IUser } from "../types/user.dto.js";
import { AbstractRepo } from "./base.repo.js";

export class UserRepo extends AbstractRepo<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByRole(role: UserRole): Promise<IUser[]> {
    return this.model.find({ role, status: UserStatusEnum.ACTIVE }).exec();
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { lastLoginAt: new Date() }).exec();
  }

  async updateRole(id: string, role: UserRole): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(id, { role }, { new: true }).exec();
  }
}
