import { Employee } from "@/domain/entities/Employee";
import { EmployeeRepoType } from "@/domain/types/employee.types";
import { UserRepoType } from "@/domain/types/user.types";
import { AppError } from "@/shared/utils/api.error";
import { CreateEmployeeDTO } from "@/presentation/validation/employee.zod";

export class CreateEmployee {
  constructor(
    private employeeRepo: EmployeeRepoType,
    private userRepo: UserRepoType,
  ) {}

  async execute(data: CreateEmployeeDTO): Promise<Employee> {
    if (!data.email) throw AppError.badRequest("Email is required");
    const email = data.email.toLowerCase();

    // Check for duplicates
    const existingInEmp = await this.employeeRepo.findByEmail(email);
    const existingInUser = await this.userRepo.findByEmail(email);

    if (existingInEmp || existingInUser) {
      throw AppError.conflict("A person with this email already exists in the system");
    }

    // Auto-generate code if not provided
    if (!data.code) {
      const lastCode = await this.employeeRepo.findLastEmployeeCode();
      let nextNumber = 1;
      if (lastCode && lastCode.startsWith("EMP-")) {
        const num = parseInt(lastCode.split("-")[1] as string);
        if (!isNaN(num)) nextNumber = num + 1;
      }
      data.code = `EMP-${nextNumber.toString().padStart(3, "0")}`;
    }

    // Set default password if not provided
    if (!data.password) {
      data.password = data.code;
    }

    const employee = new Employee(data);
    const createdEmployee = await this.employeeRepo.create(employee);
    
    // Remove password from response
    delete createdEmployee.password;
    
    return createdEmployee;
  }
}
