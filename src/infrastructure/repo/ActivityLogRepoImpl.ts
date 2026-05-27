import {
  ActivityLogRepoType,
  IActivityLog,
} from "@/domain/types/activity-log.types";
import { ActivityLog } from "@/domain/entities/ActivityLog";
import { activityLogModel } from "../database/activity-log.model";

export class ActivityLogRepoImpl implements ActivityLogRepoType {
  private toEntity(doc: IActivityLog): ActivityLog {
    return new ActivityLog({
      id: doc.id?.toString(),
      user: doc.user,
      action: doc.action,
      target: doc.target,
      details: doc.details,
      status: doc.status,
      timestamp: doc.timestamp,
    });
  }

  async create(log: ActivityLog): Promise<ActivityLog> {
    const doc = await activityLogModel.create({
      ...log,
      timestamp: log.timestamp || new Date(),
    });
    return this.toEntity(doc);
  }

  async findAll(limit = 50): Promise<ActivityLog[]> {
    const docs = await activityLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }
}
