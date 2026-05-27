import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/employee.types";

export class GetEmployeesByManager {
  constructor(private employeeRepo: EmployeeRepoType) {}

  async execute(managerId: string): Promise<Employee[]> {
    return await this.employeeRepo.findByManager(managerId);
  }
}
