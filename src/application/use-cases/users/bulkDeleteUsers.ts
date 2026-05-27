import { UserRepoType } from "@/domain/types/user.types";

import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";

export class BulkDeleteUsers {
  constructor(
    private userRepo: UserRepoType,
    private recordActivity: RecordActivity,
  ) {}

  async execute(ids: string[], performer?: IUser): Promise<number> {
    const count = await this.userRepo.bulkDelete(ids);

    if (performer && count > 0) {
      await this.recordActivity.execute({
        user: {
          username: performer.username,
          email: performer.email,
          role: performer.role!,
        },
        action: "Bulk deleted users",
        target: `${count} users`,
        details: { ids },
        timestamp: new Date(),
      });
    }

    return count;
  }
}
