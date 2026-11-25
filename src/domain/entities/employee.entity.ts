import { AggregateRoot } from "@/common/lib/aggregate-root";
import {
  EMP_TRANSITIONS,
  EmpDepartment,
  EmpJob,
  EmpJobRole,
  IEmployee,
  TEmployeeStatus,
} from "../types/employee.types";

export class EmployeeEntity extends AggregateRoot<
  TEmployeeStatus,
  typeof EMP_TRANSITIONS
> {
  public userId: string;
  public code: string;
  public department: EmpDepartment;
  public job: EmpJob;
  public jobRole: EmpJobRole;
  public salary: number;
  public hiredAt: Date;
  public leftAt?: Date | null;

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

    this.userId = params.data.userId;
    this.code = params.data.code;
    this.department = params.data.department;
    this.job = params.data.job;
    this.jobRole = params.data.jobRole;
    this.salary = params.data.salary;
    this.hiredAt = params.data.hiredAt;
    this.leftAt = params.data.leftAt;
  }
}
