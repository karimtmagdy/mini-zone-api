import { Request, Response } from "express";
import { CreateEmployee } from "@/application/use-cases/employees/createEmployee";
import { GetAllEmployees } from "@/application/use-cases/employees/getAllEmployees";
import { GetEmployeeById } from "@/application/use-cases/employees/getEmployeeById";
import { UpdateEmployee } from "@/application/use-cases/employees/updateEmployee";
import { SoftDeleteEmployee } from "@/application/use-cases/employees/softDeleteEmployee";
import { RestoreEmployee } from "@/application/use-cases/employees/restoreEmployee";
import { GetDeletedEmployees } from "@/application/use-cases/employees/getDeletedEmployees";
import { GetEmployeesByDepartment } from "@/application/use-cases/employees/getEmployeesByDepartment";
import { GetEmployeesByManager } from "@/application/use-cases/employees/getEmployeesByManager";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { Employee } from "@/domain/entities/Employee";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/shared/schema/response.schema";
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@/presentation/validation/employee.zod";

export class EmployeeController {
  constructor(
    private createEmployeeUC: CreateEmployee,
    private getAllEmployeesUC: GetAllEmployees,
    private getEmployeeByIdUC: GetEmployeeById,
    private updateEmployeeUC: UpdateEmployee,
    private softDeleteEmployeeUC: SoftDeleteEmployee,
    private restoreEmployeeUC: RestoreEmployee,
    private getDeletedEmployeesUC: GetDeletedEmployees,
    private getEmployeesByDepartmentUC: GetEmployeesByDepartment,
    private getEmployeesByManagerUC: GetEmployeesByManager,
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const body = req.body as CreateEmployeeDTO;
    const result = await this.createEmployeeUC.execute(body);
    const response: ResponseDto<Employee> = {
      status: "success",
      message: "Employee created successfully",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.getAllEmployeesUC.execute(req.query);
    const response: ResponseWithMetaDto<Employee[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getEmployeeByIdUC.execute(id);
    const response: ResponseDto<Employee> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateEmployeeDTO;
    const result = await this.updateEmployeeUC.execute(id, body);
    const response: ResponseDto<Employee | null> = {
      status: "success",
      message: "Employee updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  soft = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.softDeleteEmployeeUC.execute(id);
    const response: ResponseDto<Employee | null> = {
      status: "success",
      message: "Employee moved to archive",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreEmployeeUC.execute(id);
    const response: ResponseDto<Employee | null> = {
      status: "success",
      message: "Employee restored successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const result = await this.getDeletedEmployeesUC.execute();
    const response: ResponseDto<Employee[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getByDepartment = catchError(async (req: Request, res: Response) => {
    const { department } = req.params as { department: string };
    const result = await this.getEmployeesByDepartmentUC.execute(department);
    const response: ResponseDto<Employee[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getByManager = catchError(async (req: Request, res: Response) => {
    const { managerId } = req.params as { managerId: string };
    const result = await this.getEmployeesByManagerUC.execute(managerId);
    const response: ResponseDto<Employee[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
