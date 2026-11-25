import { EmployeeEntity } from "@/domain/entities/employee.entity";
import { EmployeeDoc, EmployeeRoute } from "@/domain/dto/employee.dto";
import { IEmployee } from "@/domain/types/employee.types";

export class EmployeeMapper {
  static toDomain(doc: EmployeeDoc): EmployeeEntity {
    const data: IEmployee = {
      userId: doc.userId.toString(),
      code: doc.code,
      department: doc.department,
      job: doc.job,
      jobRole: doc.jobRole,
      salary: doc.salary,
      hiredAt: doc.hiredAt,
      leftAt: doc.leftAt ?? null,
      status: doc.status,
      isArchived: doc.isArchived ?? false,
      archivedAt: doc.archivedAt ?? null,
    };

    return new EmployeeEntity({
      id: doc._id.toString(),
      data,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: EmployeeEntity) {
    return {
      userId: entity.userId,
      code: entity.code,
      department: entity.department,
      job: entity.job,
      jobRole: entity.jobRole,
      salary: entity.salary,
      hiredAt: entity.hiredAt,
      leftAt: entity.leftAt ?? null,
      status: entity.status,
      isArchived: entity.isArchived,
      archivedAt: entity.archivedAt,
    };
  }

  static toRoute(entity: EmployeeEntity): EmployeeRoute {
    return {
      id: entity.id,
      userId: entity.userId,
      code: entity.code,
      department: entity.department,
      job: entity.job,
      jobRole: entity.jobRole,
      salary: entity.salary,
      hiredAt: entity.hiredAt,
      leftAt: entity.leftAt ?? null,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isArchived: entity.isArchived,
      archivedAt: entity.archivedAt,
    };
  }
}
