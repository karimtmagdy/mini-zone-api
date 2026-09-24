import { AppError, ErrorCode } from "@/common/api/api-error";
import { PaginatedResult, QueryResult } from "@/types";
import { UseCase } from "@/common/use-case";
import { CategoryEntity } from "@/domain/entities/category.entity";
import { ICategoryImpl } from "@/domain/ports/category.repo.port";
import {
  TCreateCategoryEX,
  TUpdateCategoryEX,
  TUpdateCategoryStatusEX,
} from "@/presentation/validator/category.zod";

export class CreateCategoryUC extends UseCase<
  TCreateCategoryEX,
  CategoryEntity
> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(input: TCreateCategoryEX): Promise<CategoryEntity> {
    const existing = await this.repo.findByName(input.name);
    if (existing) {
      throw new AppError(
        `category with name "${input.name}" already exists`,
        409,
        ErrorCode.CONFLICT,
      );
    }
    const entity = await this.repo.create(input);
    return entity;
  }
}

export class GetCategoryByIdUC extends UseCase<string, CategoryEntity> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(id: string): Promise<CategoryEntity> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new AppError("category not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class UpdateCategoryUC extends UseCase<
  { id: string; data: TUpdateCategoryEX },
  CategoryEntity
> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(input: {
    id: string;
    data: TUpdateCategoryEX;
  }): Promise<CategoryEntity> {
    const exists = await this.repo.exists(input.id);
    if (!exists) {
      throw new AppError("category not found", 404, ErrorCode.NOT_FOUND);
    }
    if (input.data.name !== undefined) {
      const dup = await this.repo.findByName(input.data.name);
      if (dup && dup.id !== input.id) {
        throw new AppError(
          `category with name "${input.data.name}" already exists`,
          409,
          ErrorCode.CONFLICT,
        );
      }
    }
    const updated = await this.repo.update(input.id, input.data);
    if (!updated) {
      throw new AppError("category update failed", 400, ErrorCode.BAD_REQUEST);
    }
    return updated;
  }
}

export class DeleteCategoryUC extends UseCase<string, CategoryEntity> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(id: string): Promise<CategoryEntity> {
    const entity = await this.repo.delete(id);
    if (!entity) {
      throw new AppError("category not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class ArchiveCategoryUC extends UseCase<string, CategoryEntity> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(id: string): Promise<CategoryEntity> {
    const entity = await this.repo.archive(id);
    if (!entity) {
      throw new AppError("category not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class RestoreCategoryUC extends UseCase<string, CategoryEntity> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(id: string): Promise<CategoryEntity> {
    const entity = await this.repo.restore(id);
    if (!entity) {
      throw new AppError("category not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class UpdateCategoryStatusUC extends UseCase<
  { id: string; data: TUpdateCategoryStatusEX },
  CategoryEntity
> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(input: {
    id: string;
    data: TUpdateCategoryStatusEX;
  }): Promise<CategoryEntity> {
    const exists = await this.repo.exists(input.id);
    if (!exists) {
      throw new AppError("category not found", 404, ErrorCode.NOT_FOUND);
    }
    const updated = await this.repo.update(input.id, input.data);
    if (!updated) {
      throw new AppError(
        "category status update failed",
        400,
        ErrorCode.BAD_REQUEST,
      );
    }
    return updated;
  }
}

export class ListCategoryUC extends UseCase<
  Partial<QueryResult>,
  PaginatedResult<CategoryEntity>
> {
  constructor(private readonly repo: ICategoryImpl) {
    super();
  }

  async execute(
    query: Partial<QueryResult>,
  ): Promise<PaginatedResult<CategoryEntity>> {
    return this.repo.list(query);
  }
}
