import { ActivityLog } from "../entities/ActivityLog";
import { IUser } from "./user.types";

export const ACTIVITY_LOG_STATUS = [
  "success",
  "warning",
  "info",
  "error",
] as const;

export type ActivityLogStatus = (typeof ACTIVITY_LOG_STATUS)[number];

export enum ActivityLogStatusEnum {
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
  ERROR = "error",
}

export interface IActivityLog {
  id?: string;
  user: {
    username: string;
    email: string;
    role: string;
   
  };
  action: string;
  target: string;
  details?: any;
  status?: ActivityLogStatus;
  timestamp: Date;
}
export interface ActivityLogRepoType {
  create(log: Partial<ActivityLog>): Promise<ActivityLog>;
  findAll(limit?: number): Promise<ActivityLog[]>;
}
