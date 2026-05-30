import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/person.types";
import { AppError } from "@/shared/utils/api.error";

export class RestoreEmployee {
  constructor(private employeeRepo: EmployeeRepoType) {}

  async execute(id: string): Promise<Employee | null> {
    const employee = await this.employeeRepo.restore(id);
    if (!employee) AppError.notFound("employee not found in trash");
    return employee;
  }
}
