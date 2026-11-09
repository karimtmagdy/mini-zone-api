import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import { IUserFields, TUserStatus } from "@/domain/types/user.types";

export type UserDoc = IBaseMetaData &
  IUserFields &
  IBaseStatus<TUserStatus> &
  IBaseArchived;

// Export alias for convenience
export type TUserDoc = UserDoc;

export interface UserRoute
  extends Identifiable,
    Timestamped,
    Omit<IUserFields, "password">,
    IBaseStatus<TUserStatus>,
    IBaseArchived {}
