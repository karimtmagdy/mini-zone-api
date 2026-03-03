import { UserRepo } from "../repo/user.repo.js";
import { EmployeeRepo } from "../repo/employee.repo.js";
import { User } from "../class/user.js";
import { AppError } from "../class/error.factory.js";
import { UpdateUserDTO } from "../validation/user.schema.js";
import { PaginatedResult, PaginationOptions } from "../repo/base.repo.js";

export class UserService {
  constructor(
    protected userRepo: UserRepo,
    protected employeeRepo: EmployeeRepo,
  ) {}

  async getUserById(userId: string): Promise<User> {
    const doc = await this.userRepo.findById(userId);
    if (!doc) AppError.notFound("User not found");
    return new User(doc);
  }

  async createByAdmin(data: any): Promise<User> {
    // 1. Validate employee exists
    const employeeDoc = await this.employeeRepo.findById(data.employee);
    if (!employeeDoc) AppError.notFound("Employee not found");

    // 2. Ensure no user already uses this employee
    const existingUserByEmp = await this.userRepo.findByEmployee(data.employee);
    if (existingUserByEmp)
      AppError.conflict("A User account is already linked to this Employee");

    // 3. Ensure no user already uses this username or employee's email
    const existingUserByUsername = await this.userRepo.findByUsername(
      data.username,
    );
    if (existingUserByUsername)
      AppError.conflict(`Username '${data.username}' is already taken`);

    const existingUserByEmail = await this.userRepo.findByEmail(
      employeeDoc.email,
    );
    if (existingUserByEmail)
      AppError.conflict(
        `A User account already exists with the email '${employeeDoc.email}'`,
      );

    // 4. Map inherited fields
    const userData = {
      ...data,
      name: employeeDoc.name,
      email: employeeDoc.email,
      phone: employeeDoc.phone,
    };

    const doc = await this.userRepo.create(userData);
    return new User(doc);
  }

  async getAll(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const result = await this.userRepo.findAll({}, options);
    return {
      ...result,
      data: result.data.map((d) => new User(d)),
    };
  }

  async update(userId: string, data: UpdateUserDTO): Promise<User> {
    const exists = await this.userRepo.findById(userId);
    if (!exists) AppError.notFound("User not found");
    const doc = await this.userRepo.updateById(userId, data);
    if (!doc) AppError.badRequest("Failed to update user");
    return new User(doc);
  }

  async updateStatusByAdmin(userId: string, status: any): Promise<User> {
    const doc = await this.userRepo.updateStatus(userId, status);
    if (!doc) AppError.notFound("User not found");
    return new User(doc);
  }

  async deactivateByAdmin(userId: string): Promise<User> {
    // In our base repo, we don't have a direct deactivate, but we can reuse updateStatus
    // or implement it in user repo. For now, let's assume we use updateById for simplicity
    // based on original logic.
    const doc = await this.userRepo.updateById(userId, {
      status: "deactivated",
    } as any);
    if (!doc) AppError.notFound("User not found");
    return new User(doc);
  }
}
