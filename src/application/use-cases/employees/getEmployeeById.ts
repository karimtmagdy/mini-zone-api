import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/employee.types";
import { AppError } from "@/shared/utils/api.error";

export class GetEmployeeById {
  constructor(private employeeRepo: EmployeeRepoType) {}

  async execute(id: string): Promise<Employee> {
    const employee = await this.employeeRepo.findById(id);
    if (!employee) throw AppError.notFound("Employee not found");
    return employee;
  }
}
