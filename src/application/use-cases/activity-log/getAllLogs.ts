import { ActivityLogRepoType } from "@/domain/types/activity-log.types";
import { ActivityLog } from "@/domain/entities/ActivityLog";

export class GetAllLogs {
  constructor(private activityLogRepo: ActivityLogRepoType) {}

  async execute(limit?: number): Promise<ActivityLog[]> {
    return await this.activityLogRepo.findAll(limit);
  }
}
