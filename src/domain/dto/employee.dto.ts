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

export type EmployeeDoc = IBaseMetaData &
  IEmployeeFields &
  IBaseStatus<TEmployeeStatus> &
  IBaseArchived;

export interface EmployeeRoute
  extends
    Identifiable,
    Timestamped,
    IEmployeeFields,
    IBaseStatus<TEmployeeStatus>,
    IBaseArchived {}
