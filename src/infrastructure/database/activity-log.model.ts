import { Schema, model, Document } from "mongoose";

export interface IActivityLog extends Document {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  target: string;
  details?: any;
  status: "success" | "warning" | "info" | "error";
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
  },
  action: { type: String, required: true },
  target: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  status: {
    type: String,
    enum: ["success", "warning", "info", "error"],
    default: "info",
  },
  timestamp: { type: Date, default: Date.now },
});

export const activityLogModel = model<IActivityLog>("ActivityLog", ActivityLogSchema);
