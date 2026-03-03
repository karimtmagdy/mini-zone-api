import { IEmployee } from "../types/employee.types.js";
import { AbstractPerson } from "./abstract.person.js";

export abstract class Employee extends AbstractPerson<IEmployee> {
  // Properties unique to Employee
  public employeeId: string;
  public department: string;
  public jobTitle: string;
  public salary?: number | undefined;
  public hiredAt: Date;
  public managerId?: string | undefined;

  constructor(doc: IEmployee) {
    super(doc);
    this.employeeId = doc.employeeId;
    this.department = doc.department;
    this.jobTitle = doc.jobTitle;
    this.salary = doc.salary;
    this.hiredAt = doc.hiredAt;
    this.managerId = doc.managerId?.toString();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      image: this.image,
      employeeId: this.employeeId,
      department: this.department,
      jobTitle: this.jobTitle,
      salary: this.salary,
      hiredAt: this.hiredAt,
    };
  }
}
