import { IEmployee } from "../types/employee.types.js";
import { AbstractPerson } from "./abstract.person.js";

export class Employee extends AbstractPerson<IEmployee> {
  // Properties unique to Employee
  public code: string;
  public department: string;
  public jobTitle: string;
  public salary?: number | undefined;
  public hiredAt: Date;
  public managerId?: string | undefined;

  constructor(doc: IEmployee) {
    super(doc);
    this.code = doc.code;
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
      code: this.code,
      department: this.department,
      jobTitle: this.jobTitle,
      salary: this.salary,
      hiredAt: this.hiredAt,
    };
  }
}
