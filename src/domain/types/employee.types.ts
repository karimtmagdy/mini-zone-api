import { IPerson } from "@/domain/types/person.types";
import { Employee } from "../entities/Employee";
import { PaginatedResult } from "@/_R/global.dto";

export const EMPLOYEE_DEPARTMENTS = [
  "HR",
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "Support",
  "Management",
  "Operations",
  "IT",
] as const;

export const EMPLOYEE_JOB_TITLES = [
  "Manager",
  "Developer",
  "Designer",
  "Analyst",
  "Specialist",
  "Coordinator",
  "Director",
  "Lead",
  "Associate",
  "Consultant",
] as const;
export type EmployeeDepartment = (typeof EMPLOYEE_DEPARTMENTS)[number];
export type EmployeeJobTitle = (typeof EMPLOYEE_JOB_TITLES)[number];
export enum EmployeeDepartmentEnum {
  HR = "HR",
  ENGINEERING = "Engineering",
  SALES = "Sales",
  MARKETING = "Marketing",
  FINANCE = "Finance",
  SUPPORT = "Support",
  MANAGEMENT = "Management",
  OPERATIONS = "Operations",
  IT = "IT",
}

export enum EmployeeJobTitleEnum {
  MANAGER = "Manager",
  DEVELOPER = "Developer",
  DESIGNER = "Designer",
  ANALYST = "Analyst",
  SPECIALIST = "Specialist",
  COORDINATOR = "Coordinator",
  DIRECTOR = "Director",
  LEAD = "Lead",
  ASSOCIATE = "Associate",
  CONSULTANT = "Consultant",
}

export interface IEmployee extends IPerson {
  code: string;
  department: EmployeeDepartment;
  jobTitle: EmployeeJobTitle;
  salary?: number;
  hiredAt: Date;
  managerId?: any;
}
export interface EmployeeRepoType {
  create(employee: Employee): Promise<Employee>;
  findByEmail(email: string): Promise<Employee | null>;
  findById(id: string): Promise<Employee | null>;
  findAll(query: any): Promise<PaginatedResult<Employee>>;
  update(id: string, employee: Partial<Employee>): Promise<Employee | null>;
  softDelete(id: string): Promise<Employee | null>;
  restore(id: string): Promise<Employee | null>;
  findDeleted(): Promise<Employee[]>;
  exists(filter: any): Promise<boolean>;
  findLastEmployeeCode(): Promise<string | null>;
  findByDepartment(department: string): Promise<Employee[]>;
  findByManager(managerId: string): Promise<Employee[]>;
}
