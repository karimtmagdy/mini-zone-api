import { EmployeeModel } from "../models/employee.model.js";
import { IEmployee } from "../types/employee.types.js";
import { AbstractRepo } from "./base.repo.js";
import { UserStatusEnum } from "../types/user-role.enums.js";

export class EmployeeRepo extends AbstractRepo<IEmployee> {
  constructor() {
    super(EmployeeModel);
  }

  async findByEmail(email: string): Promise<IEmployee | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findLastEmployeeCode(): Promise<string | null> {
    const lastEmp = await this.model
      .findOne({})
      .sort({ createdAt: -1 })
      .select("code")
      .exec();
    return lastEmp?.code || null;
  }

  async findByDepartment(department: string): Promise<IEmployee[]> {
    return this.model
      .find({ department, status: UserStatusEnum.ACTIVE })
      .exec();
  }

  async findByManager(managerId: string): Promise<IEmployee[]> {
    return this.model.find({ managerId, status: UserStatusEnum.ACTIVE }).exec();
  }

  async softDelete(id: string): Promise<IEmployee | null> {
    return this.model
      .findByIdAndUpdate(id, { status: UserStatusEnum.INACTIVE }, { new: true })
      .exec();
  }
}
