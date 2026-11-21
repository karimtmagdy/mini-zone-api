import { BrandEntity } from "@/domain/entities/brand.entity";
import { AppError, ErrorCode } from "@/common/api/api-error";
import {
  TCreateBrandEX,
  TUpdateBrandEX,
  TUpdateBrandStatusEX,
} from "@/presentation/validator/brand.zod";
import { PaginatedResult, QueryResult } from "@/types";
import { UseCase } from "@/common/use-case";
import { IBrandImpl } from "@/domain/interfaces/brand.repo.impl";

export class CreateBrandUC extends UseCase<TCreateBrandEX, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(input: TCreateBrandEX): Promise<BrandEntity> {
    const existing = await this.repo.findByName(input.name);
    if (existing) {
      throw new AppError(
        `brand with name "${input.name}" already exists`,
        409,
        ErrorCode.CONFLICT,
      );
    }
    const entity = await this.repo.create(input);
    return entity;
  }
}

export class GetBrandByIdUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class UpdateBrandUC extends UseCase<
  { id: string; data: TUpdateBrandEX },
  BrandEntity
> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(input: {
    id: string;
    data: TUpdateBrandEX;
  }): Promise<BrandEntity> {
    const exists = await this.repo.exists(input.id);
    if (!exists) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    if (input.data.name !== undefined) {
      const dup = await this.repo.findByName(input.data.name);
      if (dup && dup.id !== input.id) {
        throw new AppError(
          `brand with name "${input.data.name}" already exists`,
          409,
          ErrorCode.CONFLICT,
        );
      }
    }
    const updated = await this.repo.update(input.id, input.data);
    if (!updated) {
      throw new AppError("brand update failed", 400, ErrorCode.BAD_REQUEST);
    }
    return updated;
  }
}

export class DeleteBrandUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const entity = await this.repo.delete(id);
    if (!entity) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class ArchiveBrandUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    if (existing.isArchived) {
      throw new AppError("brand already archived", 409, ErrorCode.CONFLICT);
    }
    const entity = await this.repo.archive(id);
    if (!entity) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class RestoreBrandUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    if (!existing.isArchived) {
      throw new AppError("brand already restored", 409, ErrorCode.CONFLICT);
    }
    const entity = await this.repo.restore(id);
    if (!entity) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    return entity;
  }
}

export class UpdateBrandStatusUC extends UseCase<
  { id: string; data: TUpdateBrandStatusEX },
  BrandEntity
> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(input: {
    id: string;
    data: TUpdateBrandStatusEX;
  }): Promise<BrandEntity> {
    const exists = await this.repo.exists(input.id);
    if (!exists) {
      throw new AppError("brand not found", 404, ErrorCode.NOT_FOUND);
    }
    const updated = await this.repo.update(input.id, input.data);
    if (!updated) {
      throw new AppError(
        "brand status update failed",
        400,
        ErrorCode.BAD_REQUEST,
      );
    }
    return updated;
  }
}

export class ListBrandsUC extends UseCase<
  Partial<QueryResult>,
  PaginatedResult<BrandEntity>
> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(
    query: Partial<QueryResult>,
  ): Promise<PaginatedResult<BrandEntity>> {
    return this.repo.list(query);
  }
}
