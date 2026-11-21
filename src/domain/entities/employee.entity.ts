import { AggregateRoot } from "@/common/lib/aggregate-root";
import {
  EMP_TRANSITIONS,
  EmpDepartment,
  EmpJob,
  EmpRole,
  IEmployee,
  TEmployeeStatus,
} from "../types/employee.types";

export class EmployeeEntity extends AggregateRoot<
  TEmployeeStatus,
  typeof EMP_TRANSITIONS
> {
  public code: string;
  public department: EmpDepartment;
  public job: EmpJob;
  public salary: number;
  public hiredAt: Date;
  leftAt?: Date;
  public role: EmpRole;

  constructor(params: {
    id: string;
    data: IEmployee;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super({
      id: params.id,
      status: params.data.status,
      transitions: EMP_TRANSITIONS,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      isArchived: params.data.isArchived,
      archivedAt: params.data.archivedAt,
    });

    this.code = params.data.code;
    this.department = params.data.department;
    this.role = params.data.role;
    this.hiredAt = params.data.hiredAt;
    this.leftAt = params.data.leftAt;
    this.salary = params.data.salary;
    this.job = params.data.job;
  }
}
