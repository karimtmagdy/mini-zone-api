import { EmployeeRepo } from "../repo/employee.repo.js";
import { Employee } from "../class/employee.js";
import { AppError } from "../class/error.factory.js";
import { IEmployee } from "../types/employee.types.js";
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeQueryDTO,
} from "../validation/employee.schema.js";
import { PaginatedResult, PaginationOptions } from "../repo/base.repo.js";

export class EmployeeService {
  constructor(private readonly repo: EmployeeRepo) {}

  async create(dto: CreateEmployeeDTO): Promise<Employee> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing)
      AppError.conflict(`Employee with email '${dto.email}' already exists`);

    // Auto-generate code
    const lastIdStr = await this.repo.findLastEmployeeCode();
    let nextNum = 1;
    if (lastIdStr && lastIdStr.startsWith("EMP-")) {
      const parts = lastIdStr.split("-");
      const lastNum = parseInt(parts[1] || "", 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }

    // Format to EMP-001, EMP-010, etc.
    const newEmployeeCode = `EMP-${nextNum.toString().padStart(3, "0")}`;

    const employeeData = {
      ...dto,
      code: newEmployeeCode,
    } as Partial<IEmployee>;

    const doc = await this.repo.create(employeeData);
    return new Employee(doc);
  }

  async getById(id: string): Promise<Employee> {
    const doc = await this.repo.findById(id);
    if (!doc) AppError.notFound(`Employee '${id}' not found`);
    return new Employee(doc);
  }

  async getAll(query: EmployeeQueryDTO): Promise<PaginatedResult<Employee>> {
    const filter: Record<string, unknown> = {};
    if (query.department) filter.department = query.department;
    if (query.isActive !== undefined) filter.isActive = query.isActive;

    const pagination: PaginationOptions = {
      page: query.page,
      limit: query.limit,
    };
    const result = await this.repo.findAll(filter, pagination);
    return {
      ...result,
      data: result.data.map((d) => new Employee(d)),
    };
  }

  async update(id: string, dto: UpdateEmployeeDTO): Promise<Employee> {
    const doc = await this.repo.updateById(id, dto as Partial<IEmployee>);
    if (!doc) AppError.notFound(`Employee '${id}' not found`);
    return new Employee(doc);
  }

  async deactivate(id: string): Promise<Employee> {
    const doc = await this.repo.softDelete(id);
    if (!doc) AppError.notFound(`Employee '${id}' not found`);
    return new Employee(doc);
  }

  async getByDepartment(department: string): Promise<Employee[]> {
    const docs = await this.repo.findByDepartment(department);
    return docs.map((d) => new Employee(d));
  }
}
