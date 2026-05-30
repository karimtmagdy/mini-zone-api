import { Person } from "./Person";
import { EmployeeDepartment, EmployeeJobTitle } from "@/domain/types/person.types";

export class Employee extends Person {
  public code!: string;
  public department!: EmployeeDepartment;
  public jobTitle!: EmployeeJobTitle;
  public salary?: number;
  public hiredAt?: Date;
  public managerId?: string;

  constructor(data: Partial<Employee>) {
    super(data);
    Object.assign(this, data);
  }
}
