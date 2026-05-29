import { UserRepoType } from "@/domain/types/user.types";
import { PersonStatusEnum } from "@/domain/types/person.types";

// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";

export class BulkDeactivateUsers {
  constructor(
    private userRepo: UserRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(ids: string[], performer?: IUser): Promise<number> {
    const count = await this.userRepo.bulkUpdate(
      ids,
      { status: PersonStatusEnum.DEACTIVATED },
      performer?.id,
    );

    if (performer && count > 0) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: "Bulk deactivated users",
    //    target: `${count} users`,
    //    details: { ids },
    //    timestamp: new Date(),
    //   });
    }

    return count;
  }
}
