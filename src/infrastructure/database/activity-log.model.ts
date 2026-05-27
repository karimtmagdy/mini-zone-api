import {
  ActivityLogStatusEnum,
  ACTIVITY_LOG_STATUS,
  IActivityLog,
} from "@/domain/types/activity-log.types";
import { getSchemaOptions } from "@/shared/schema/fields";
import { Schema, model } from "mongoose";

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      username: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
    action: { type: String, required: true },
    target: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ACTIVITY_LOG_STATUS,
      default: ActivityLogStatusEnum.INFO,
    },
    timestamp: { type: Date, default: Date.now },
  },
  getSchemaOptions("activity-logs"),
);

export const activityLogModel = model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema,
);
