import { User } from "@/domain/entities/User";
import { UserRepoType } from "@/domain/types/user.types";
import { AppError } from "@/shared/utils/api.error";
import { PersonStatus } from "@/domain/types/person.types";
import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";

export class UpdateUserStatus {
  constructor(
    private userRepo: UserRepoType,
    private recordActivity: RecordActivity,
  ) {}

  async execute(
    id: string,
    status: PersonStatus,
    performer?: IUser,
    additionalData: any = {},
  ): Promise<User> {
    const user = await this.userRepo.update(
      id,
      { status, ...additionalData },
      performer?.id,
    );
    if (!user) throw AppError.notFound("User not found");

    if (performer) {
      await this.recordActivity.execute({
        user: {
          username: performer.username,
          email: performer.email,
          role: performer.role!,
        },
        action: `Updated status to ${status}`,
        target: `User: ${user.username}`,
        details: { userId: id, ...additionalData },
        timestamp: new Date(),
      });
    }

    return user;
  }
}
