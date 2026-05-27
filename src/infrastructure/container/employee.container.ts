import { EmployeeRepoImpl } from "@/infrastructure/repo/EmployeeRepoImpl";
import { UserRepoImpl } from "@/infrastructure/repo/UserRepoImpl";
import { CreateEmployee } from "@/application/use-cases/employees/createEmployee";
import { GetAllEmployees } from "@/application/use-cases/employees/getAllEmployees";
import { GetEmployeeById } from "@/application/use-cases/employees/getEmployeeById";
import { UpdateEmployee } from "@/application/use-cases/employees/updateEmployee";
import { SoftDeleteEmployee } from "@/application/use-cases/employees/softDeleteEmployee";
import { RestoreEmployee } from "@/application/use-cases/employees/restoreEmployee";
import { GetDeletedEmployees } from "@/application/use-cases/employees/getDeletedEmployees";
import { GetEmployeesByDepartment } from "@/application/use-cases/employees/getEmployeesByDepartment";
import { GetEmployeesByManager } from "@/application/use-cases/employees/getEmployeesByManager";
import { EmployeeController } from "@/presentation/controllers/employee.controller";

// Infrastructure
const employeeRepository = new EmployeeRepoImpl();
const userRepository = new UserRepoImpl();

// Application
export const createEmployeeUseCase = new CreateEmployee(
  employeeRepository,
  userRepository,
);
export const getAllEmployeesUseCase = new GetAllEmployees(employeeRepository);
export const getEmployeeByIdUseCase = new GetEmployeeById(employeeRepository);
export const updateEmployeeUseCase = new UpdateEmployee(
  employeeRepository,
  userRepository,
);
export const softDeleteEmployeeUseCase = new SoftDeleteEmployee(
  employeeRepository,
);
export const restoreEmployeeUseCase = new RestoreEmployee(employeeRepository);
export const getDeletedEmployeesUseCase = new GetDeletedEmployees(
  employeeRepository,
);
export const getEmployeesByDepartmentUseCase = new GetEmployeesByDepartment(
  employeeRepository,
);
export const getEmployeesByManagerUseCase = new GetEmployeesByManager(
  employeeRepository,
);

// Presentation
export const employeeCtrl = new EmployeeController(
  createEmployeeUseCase,
  getAllEmployeesUseCase,
  getEmployeeByIdUseCase,
  updateEmployeeUseCase,
  softDeleteEmployeeUseCase,
  restoreEmployeeUseCase,
  getDeletedEmployeesUseCase,
  getEmployeesByDepartmentUseCase,
  getEmployeesByManagerUseCase,
);
