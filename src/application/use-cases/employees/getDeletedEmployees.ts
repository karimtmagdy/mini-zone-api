import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/person.types";

export class GetDeletedEmployees {
  constructor(private employeeRepo: EmployeeRepoType) {}

  async execute(): Promise<Employee[]> {
    return await this.employeeRepo.findDeleted();
  }
}
