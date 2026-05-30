import { Employee } from "@/domain/entities/Employee";
 import { UserRepoType,EmployeeRepoType } from "@/domain/types/person.types";
import { UpdateEmployeeDTO } from "@/shared/schema/person.zod";
import { AppError } from "@/shared/utils/api.error";
 
export class UpdateEmployee {
  constructor(
    private employeeRepo: EmployeeRepoType,
    private userRepo: UserRepoType,
  ) {}

  async execute(id: string, data: UpdateEmployeeDTO): Promise<Employee | null> {
    const isExist = await this.employeeRepo.findById(id);
    if (!isExist) {
      throw AppError.notFound("Employee not found");
    }

    if (data.email) {
      const email = data.email.toLowerCase();
      
      const existingInUser = await this.userRepo.findByEmail(email);
      if (existingInUser) {
        throw AppError.conflict("This email is already registered as a User");
      }

      const existingInEmp = await this.employeeRepo.findByEmail(email);
      if (existingInEmp && existingInEmp.id !== id) {
        throw AppError.conflict("This email is already registered to another employee");
      }
    }

    const updatedEmployee = await this.employeeRepo.update(id, data);
    if (updatedEmployee) delete updatedEmployee.password;
    return updatedEmployee;
  }
}
