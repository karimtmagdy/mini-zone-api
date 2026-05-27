import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/employee.types";
import { PaginatedResult } from "@/_R/global.dto";

export class GetAllEmployees {
  constructor(private employeeRepo: EmployeeRepoType) {}

  async execute(query: any): Promise<PaginatedResult<Employee>> {
    return await this.employeeRepo.findAll(query);
  }
}
