import { ActivityLogStatus, IActivityLog } from "../types/activity-log.types";
import { IUser } from "../types/person.types";
export class ActivityLog implements IActivityLog {
  public id?: string;
  public user!: Pick<IUser,'username'|'email'|'role'>
  public action!: string;
  public target!: string;
  public details?: any;
  public status?: ActivityLogStatus;
  public timestamp!: Date;
  public performer?: Pick<IUser,'username'|'email'|'role'>
 

  constructor(data: Partial<ActivityLog>) {
    Object.assign(this, data);
  }
}
