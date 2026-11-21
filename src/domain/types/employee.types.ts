import { getStatus } from "@/common/generator/transitions";
import { IBaseArchived, IBaseStatus } from "@/types";

export const EMP_DEPARTMENT = [
  "hr",
  "engineering",
  "sales",
  "marketing",
  "finance",
  "support",
  "management",
  "operations",
  "it",
] as const;
export type EmpDepartment = (typeof EMP_DEPARTMENT)[number];
export const EMP_JOBS = [
  "specialist",
  "coordinator",
  "director",
  "lead",
  "associate",
  "consultant",
] as const;
export type EmpJob = (typeof EMP_JOBS)[number];

export const EMP_ROLE = [
  "admin",
  "manager",
  "warehouseManager",
  "sales",
  "accountant",
] as const;
export type EmpJobRole = (typeof EMP_ROLE)[number];

export const EMP_TRANSITIONS = {
  pending: ["active", "terminated"],
  active: ["suspended", "inactive", "terminated"],
  suspended: ["active", "terminated"],
  inactive: ["active", "terminated"],
  terminated: ["archive"],
  banned: ["archive"],
  archive: [],
} as const;
export const EMP_STATUS = getStatus(EMP_TRANSITIONS);
export type TEmployeeStatus = (typeof EMP_STATUS)[number];

export interface IEmployeeFields {
  code: string;
  department: EmpDepartment;
  job: EmpJob;
  jobRole: EmpJobRole;
  salary: number;
  hiredAt: Date;
  leftAt?: Date;
}

export interface IEmployee
  extends IEmployeeFields, IBaseStatus<TEmployeeStatus>, IBaseArchived {}
