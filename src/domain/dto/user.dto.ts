import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import { IUserFields, TUserStatus } from "@/domain/types/user.types";

import { IPersonFields } from "@/domain/types/person.types";

export type CustomerDoc = IBaseMetaData &
  IUserFields &
  IPersonFields &
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
