import { ActivityLogRepoType } from "@/domain/types/activity-log.types";
import { ActivityLog } from "@/domain/entities/ActivityLog";

export class RecordActivity {
  constructor(private activityLogRepo: ActivityLogRepoType) {}

  async execute(data: Partial<ActivityLog>): Promise<ActivityLog | void> {
    try {
      return await this.activityLogRepo.create(data);
    } catch (error) {
      console.error("Failed to record activity log:", error);
    }
  }
}
