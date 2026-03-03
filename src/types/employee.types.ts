import { IBase } from "./base.types.js";

export interface IEmployee extends IBase {
  employeeId: string;
  department: string;
  jobTitle: string;
  salary: number;
  hiredAt: Date;
  managerId?: string;
}
