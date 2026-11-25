import { AppError, ErrorCode } from "@/common/api/api-error";
import { generateCode } from "@/common/generator/generate-code";
import {
  permissionsForJobRole,
  permissionsForUserRole,
} from "@/common/rule/role-permission";
import { UseCase } from "@/common/use-case";
import { EmployeeEntity } from "@/domain/entities/employee.entity";
import { IAuthImpl } from "@/domain/interfaces/auth.repo.impl";
import { IEmployeeImpl } from "@/domain/interfaces/employee.repo.impl";
import {
  TBootstrapAdminEX,
  TCreateEmployeeEX,
  THireEmployeeEX,
  TUpdateEmployeeEX,
  TUpdateEmployeeStatusEX,
} from "@/presentation/validator/employee.zod";
import { PaginatedResult, QueryResult } from "@/types";

const promoteUserToEmployee = async (
  authRepo: IAuthImpl,
  userId: string,
  jobRole: TCreateEmployeeEX["jobRole"],
) => {
  const updated = await authRepo.updateAccess(userId, {
    role: "employee",
    permissions: permissionsForJobRole(jobRole),
  });
  if (!updated) {
    throw new AppError("user not found", 404, ErrorCode.NOT_FOUND);
  }
  return updated;
};

const demoteUserToCustomer = async (authRepo: IAuthImpl, userId: string) => {
  await authRepo.updateAccess(userId, {
    role: "customer",
    permissions: permissionsForUserRole("customer"),
  });
};

export class CreateEmployeeUC extends UseCase<
  TCreateEmployeeEX,
  EmployeeEntity
> {
  constructor(
    private readonly repo: IEmployeeImpl,
    private readonly authRepo: IAuthImpl,
  ) {
    super();
  }

  async execute(input: TCreateEmployeeEX): Promise<EmployeeEntity> {
    const user = await this.authRepo.findById(input.userId);
    if (!user) {
      throw new AppError("user not found", 404, ErrorCode.NOT_FOUND);
    }
    if (user.isArchived) {
      throw new AppError("user account is archived", 403, ErrorCode.FORBIDDEN);
    }
    if (user.status !== "active") {
      throw new AppError("user account is blocked", 403, ErrorCode.FORBIDDEN);
    }

    const existing = await this.repo.findByUserId(input.userId);
    if (existing) {
      throw new AppError(
        "user is already linked to an employee profile",
        409,
        ErrorCode.CONFLICT,
      );
    }

    const entity = await this.repo.create({
      ...input,
      code: generateCode("EMP"),
    });

    await promoteUserToEmployee(this.authRepo, input.userId, input.jobRole);
    return entity;
  }
}

export class BootstrapAdminUC extends UseCase<
  { userId: string; data: TBootstrapAdminEX },
  EmployeeEntity
> {
  constructor(
    private readonly repo: IEmployeeImpl,
    private readonly authRepo: IAuthImpl,
    private readonly createUC: CreateEmployeeUC,
  ) {
    super();
  }

  async execute(input: {
    userId: string;
    data: TBootstrapAdminEX;
  }): Promise<EmployeeEntity> {
    if (await this.repo.hasAdmin()) {
      throw new AppError(
        "admin already exists — use employee create instead",
        409,
        ErrorCode.CONFLICT,
      );
    }

    const existing = await this.repo.findByUserId(input.userId);
    if (existing) {
      const updated = await this.repo.update(existing.id, {
        department: input.data.department,
        job: input.data.job,
        jobRole: "admin",
        salary: input.data.salary ?? existing.salary,
        status: "active",
      });
      if (!updated) {
        throw new AppError("employee update failed", 400, ErrorCode.BAD_REQUEST);
      }
      await promoteUserToEmployee(this.authRepo, input.userId, "admin");
      return updated;
    }

    return this.createUC.execute({
      userId: input.userId,
      department: input.data.department,
      job: input.data.job,
      jobRole: "admin",
      salary: input.data.salary,
      hiredAt: input.data.hiredAt,
      status: "active",
    });
  }
}

/** Registers a login account and links an employee profile in one step. */
export class HireEmployeeUC extends UseCase<THireEmployeeEX, EmployeeEntity> {
  constructor(
    private readonly authRepo: IAuthImpl,
    private readonly createUC: CreateEmployeeUC,
  ) {
    super();
  }

  async execute(input: THireEmployeeEX): Promise<EmployeeEntity> {
    const existing = await this.authRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError("email is already registered", 409, ErrorCode.CONFLICT);
    }

    const user = await this.authRepo.create({
      username: input.username,
      email: input.email,
      password: input.password,
      role: "customer",
      permissions: permissionsForUserRole("customer"),
    });

    return this.createUC.execute({
      userId: user.id,
      department: input.department,
      job: input.job,
      jobRole: input.jobRole,
      salary: input.salary,
      status: input.status ?? "active",
    });
  }
}

export class GetEmployeeByIdUC extends UseCase<string, EmployeeEntity> {
  constructor(private readonly repo: IEmployeeImpl) {
    super();
  }

  async execute(id: string): Promise<EmployeeEntity> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class UpdateEmployeeUC extends UseCase<
  { id: string; data: TUpdateEmployeeEX },
  EmployeeEntity
> {
  constructor(
    private readonly repo: IEmployeeImpl,
    private readonly authRepo: IAuthImpl,
  ) {
    super();
  }

  async execute(input: {
    id: string;
    data: TUpdateEmployeeEX;
  }): Promise<EmployeeEntity> {
    const current = await this.repo.findById(input.id);
    if (!current) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }

    const updated = await this.repo.update(input.id, input.data);
    if (!updated) {
      throw new AppError("employee update failed", 400, ErrorCode.BAD_REQUEST);
    }

    if (input.data.jobRole && input.data.jobRole !== current.jobRole) {
      await promoteUserToEmployee(
        this.authRepo,
        updated.userId,
        input.data.jobRole,
      );
    }

    return updated;
  }
}

export class DeleteEmployeeUC extends UseCase<string, EmployeeEntity> {
  constructor(
    private readonly repo: IEmployeeImpl,
    private readonly authRepo: IAuthImpl,
  ) {
    super();
  }

  async execute(id: string): Promise<EmployeeEntity> {
    const entity = await this.repo.delete(id);
    if (!entity) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }
    await demoteUserToCustomer(this.authRepo, entity.userId);
    return entity;
  }
}

export class ArchiveEmployeeUC extends UseCase<string, EmployeeEntity> {
  constructor(private readonly repo: IEmployeeImpl) {
    super();
  }

  async execute(id: string): Promise<EmployeeEntity> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }
    if (existing.isArchived) {
      throw new AppError("employee already archived", 409, ErrorCode.CONFLICT);
    }
    const entity = await this.repo.archive(id);
    if (!entity) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class RestoreEmployeeUC extends UseCase<string, EmployeeEntity> {
  constructor(private readonly repo: IEmployeeImpl) {
    super();
  }

  async execute(id: string): Promise<EmployeeEntity> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }
    if (!existing.isArchived) {
      throw new AppError("employee already restored", 409, ErrorCode.CONFLICT);
    }
    const entity = await this.repo.restore(id);
    if (!entity) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class UpdateEmployeeStatusUC extends UseCase<
  { id: string; data: TUpdateEmployeeStatusEX },
  EmployeeEntity
> {
  constructor(
    private readonly repo: IEmployeeImpl,
    private readonly authRepo: IAuthImpl,
  ) {
    super();
  }

  async execute(input: {
    id: string;
    data: TUpdateEmployeeStatusEX;
  }): Promise<EmployeeEntity> {
    const current = await this.repo.findById(input.id);
    if (!current) {
      throw new AppError("employee not found", 404, ErrorCode.NOT_FOUND);
    }

    // Validate transition through the aggregate before persisting.
    current.transition(input.data.status);

    const updated = await this.repo.update(input.id, {
      status: input.data.status,
      ...(input.data.status === "terminated" ? { leftAt: new Date() } : {}),
    });
    if (!updated) {
      throw new AppError(
        "employee status update failed",
        400,
        ErrorCode.BAD_REQUEST,
      );
    }

    if (input.data.status === "terminated") {
      await demoteUserToCustomer(this.authRepo, updated.userId);
    }

    return updated;
  }
}

export class ListEmployeesUC extends UseCase<
  Partial<QueryResult>,
  PaginatedResult<EmployeeEntity>
> {
  constructor(private readonly repo: IEmployeeImpl) {
    super();
  }

  async execute(
    query: Partial<QueryResult>,
  ): Promise<PaginatedResult<EmployeeEntity>> {
    return this.repo.list(query);
  }
}
