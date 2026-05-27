import { ActivityLogStatus, IActivityLog } from "../types/activity-log.types";
export class ActivityLog implements IActivityLog {
  public id?: string;
  public user!: {
    username: string;
    email: string;
    role: string;
  };
  public action!: string;
  public target!: string;
  public details?: any;
  public status?: ActivityLogStatus;
  public timestamp!: Date;
  public performer?: {
    username: string;
    email: string;
    role: string;
  };

  constructor(data: Partial<ActivityLog>) {
    Object.assign(this, data);
  }
}
