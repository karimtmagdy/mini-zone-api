import { EmployeeModel } from "../models/employee.model.js";
import { IEmployee } from "../types/employee.types.js";
import { AbstractRepo } from "./base.repo.js";

export class EmployeeRepo extends AbstractRepo<IEmployee> {
  constructor() {
    super(EmployeeModel);
  }

  async findByEmail(email: string): Promise<IEmployee | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByDepartment(department: string): Promise<IEmployee[]> {
    return this.model.find({ department, isActive: true }).exec();
  }

  async findByManager(managerId: string): Promise<IEmployee[]> {
    return this.model.find({ managerId, isActive: true }).exec();
  }

  async softDelete(id: string): Promise<IEmployee | null> {
    return this.model
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }
}
