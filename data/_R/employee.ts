import {
  EmployeeDto,
  EmployeeDepartment,
  EmployeeJobTitle,
} from "@/_R/user.types";
import { AbstractPerson } from "./person.abstract";

export class Employee extends AbstractPerson<EmployeeDto> {
  // Properties unique to Employee
  public code: string;
  public department: EmployeeDepartment;
  public jobTitle: EmployeeJobTitle;
  public salary: number;
  public hiredAt: Date;
  public managerId?: string;

  constructor(doc: EmployeeDto) {
    super(doc);
    this.code = doc.code;
    this.department = doc.department;
    this.jobTitle = doc.jobTitle;
    this.salary = doc.salary;
    this.hiredAt = doc.hiredAt;
    this.managerId = doc.managerId;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      image: this.image,
      code: this.code,
      department: this.department,
      jobTitle: this.jobTitle,
      salary: this.salary,
      hiredAt: this.hiredAt,
      role: this._doc.role,
      status: this.status,
      state: this.state,
      createdAt: this.createdAt,
    };
  }
}
