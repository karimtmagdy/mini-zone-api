import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/person.types";
 import { AppError } from "@/shared/utils/api.error";

export class SoftDeleteEmployee {
  constructor(private employeeRepo: EmployeeRepoType) {}

  async execute(id: string): Promise<Employee | null> {
    const isExist = await this.employeeRepo.findById(id);
    if (!isExist) throw AppError.notFound("Employee not found");

    return await this.employeeRepo.softDelete(id);
  }
}
