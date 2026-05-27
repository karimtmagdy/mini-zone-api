import { User } from "@/domain/entities/User";
import { UserRepoType, UserRole } from "@/domain/types/user.types";
import { AppError } from "@/shared/utils/api.error";
import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";

export class ChangeUserRole {
  constructor(
    private userRepo: UserRepoType,
    private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, role: UserRole, performer?: IUser): Promise<User> {
    const user = await this.userRepo.update(id, { role }, performer?.id);
    if (!user) throw AppError.notFound("User not found");

    if (performer) {
      await this.recordActivity.execute({
        user: {
          username: performer.username,
          email: performer.email,
          role: performer.role!,
        },
        action: `Changed role to ${role}`,
        target: `User: ${user.username}`,
        details: { userId: id, newRole: role },
        timestamp: new Date(),
      });
    }

    return user;
  }
}
