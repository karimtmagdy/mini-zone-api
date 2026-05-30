import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/person.types";

export class GetEmployeesByDepartment {
  constructor(private employeeRepo: EmployeeRepoType) {}

  async execute(department: string): Promise<Employee[]> {
    return await this.employeeRepo.findByDepartment(department);
  }
}
