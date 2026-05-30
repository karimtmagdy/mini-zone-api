import { User } from "@/domain/entities/User";
 import { AppError } from "@/shared/utils/api.error";

// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser,UserRepoType } from "@/domain/types/person.types";

export class SoftDeleteUser {
  constructor(
    private userRepo: UserRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer?: IUser): Promise<User | null> {
    const user = await this.userRepo.softDelete(id, performer?.id);
    if (!user) throw AppError.notFound("User not found");

    if (performer) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: "Archived user",
    //    target: `User: ${user.username}`,
    //    details: { userId: id },
    //    timestamp: new Date(),
    //   });
    }

    return user;
  }
}
