import { EmployeeRepoType, IEmployee } from "@/domain/types/employee.types";
import { Employee } from "@/domain/entities/Employee";
import { employeeModel } from "@/infrastructure/database/employee.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { PaginatedResult } from "@/_R/global.dto";
import { PersonStatusEnum } from "@/domain/types/person.types";

export class EmployeeRepoImpl implements EmployeeRepoType {
  private toEntity(doc: IEmployee): Employee {
    return new Employee({
      id: doc.id?.toString(),
       username: doc.username,
      email: doc.email,
      role: doc.role,
      status: doc.status,
      state: doc.state,
      code: doc.code,
      department: doc.department,
      jobTitle: doc.jobTitle,
      salary: doc.salary,
      hiredAt: doc.hiredAt,
      managerId: doc.managerId?.toString(),
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(employee: Employee): Promise<Employee> {
    const doc = await employeeModel.create(employee as unknown as IEmployee);
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await employeeModel.findById(id).populate("managerId").lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await employeeModel.findOne({ email }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(query: any): Promise<PaginatedResult<Employee>> {
    const features = new APIFeatures(employeeModel, query);
    const data = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["username", "email", "code"])
      .populate("managerId")
      .execute();

    return {
      ...data,
      data: data.data.map((doc: any) => this.toEntity(doc)),
    };
  }

  async update(
    id: string,
    employee: Partial<Employee>,
  ): Promise<Employee | null> {
    const doc = await employeeModel.findByIdAndUpdate(id, employee, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string): Promise<Employee | null> {
    const doc = await employeeModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: PersonStatusEnum.ARCHIVED },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string): Promise<Employee | null> {
    const doc = await employeeModel
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: PersonStatusEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Employee[]> {
    const docs = await employeeModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true })
      .lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await employeeModel.countDocuments(filter);
    return count > 0;
  }

  async findLastEmployeeCode(): Promise<string | null> {
    const lastEmp = await employeeModel.findOne().sort({ createdAt: -1 });
    return lastEmp ? lastEmp.code : null;
  }

  async findByDepartment(department: string): Promise<Employee[]> {
    const docs = await employeeModel.find({ department }).lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findByManager(managerId: string): Promise<Employee[]> {
    const docs = await employeeModel.find({ managerId }).lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }
}
