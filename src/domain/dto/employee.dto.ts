import {
  IEmployeeFields,
  TEmployeeStatus,
} from "@/domain/types/employee.types";
import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import { Types } from "mongoose";

export type EmployeeDoc = Omit<IBaseMetaData, never> &
  Omit<IEmployeeFields, "userId"> & {
    userId: Types.ObjectId | string;
  } & IBaseStatus<TEmployeeStatus> &
  IBaseArchived;

export interface EmployeeRoute
  extends
    Identifiable,
    Timestamped,
    IEmployeeFields,
    IBaseStatus<TEmployeeStatus>,
    IBaseArchived {}
