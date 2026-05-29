import { User } from "@/domain/entities/User";
import { UserRepoType } from "@/domain/types/user.types";
import { EmployeeRepoType } from "@/domain/types/employee.types";
import { AppError } from "@/shared/utils/api.error";
import { UpdateUserDTO } from "@/presentation/validation/user.zod";
// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";

export class UpdateUser {
  constructor(
    private userRepo: UserRepoType,
    private employeeRepo: EmployeeRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(
    id: string,
    data: UpdateUserDTO,
    performer?: IUser,
  ): Promise<User> {
    if (data.email) {
      const email = data.email.toLowerCase();

      // 1. Check if email exists in Employee table
      const existingInEmp = await this.employeeRepo.findByEmail(email);
      if (existingInEmp) {
        throw AppError.conflict(
          "This email is already registered as an Employee",
        );
      }

      // 2. Check if email exists in User table for another user
      const existingInUser = await this.userRepo.findByEmail(email);
      if (existingInUser && existingInUser.id !== id) {
        throw AppError.conflict(
          "This email is already registered to another user",
        );
      }
    }
    const user = await this.userRepo.update(id, data, performer?.id);
    if (!user) throw AppError.notFound("User not found");

    if (performer) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: "Updated user profile",
    //    target: `User: ${user.username}`,
    //    details: { userId: id, updatedFields: Object.keys(data) },
    //    timestamp: new Date(),
    //   });
    }

    return user;
  }
}
