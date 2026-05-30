import {  UserRepoType,IUser } from "@/domain/types/person.types";

// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
 

export class BulkArchiveUsers {
  constructor(
    private userRepo: UserRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(ids: string[], performer?: IUser): Promise<number> {
    const count = await this.userRepo.bulkUpdate(
      ids,
      {
        status: "archived",
        deletedAt: new Date(),
      },
      performer?.id,
    );

    if (performer && count > 0) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: "Bulk archived users",
    //    target: `${count} users`,
    //    details: { ids },
    //    timestamp: new Date(),
    //   });
    }

    return count;
  }
}
