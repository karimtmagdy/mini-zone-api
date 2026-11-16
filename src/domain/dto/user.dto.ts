import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import { IUserFields, TUserStatus } from "@/domain/types/user.types";

export type CustomerDoc = IBaseMetaData &
  IUserFields &
  IBaseStatus<TUserStatus> &
  IBaseArchived;

// Export alias for convenience
export type TCustomerDoc = CustomerDoc;

export interface CustomerRoute
  extends
    Identifiable,
    Timestamped,
    Omit<IUserFields, "password">,
    IBaseStatus<TUserStatus>,
    IBaseArchived {}
