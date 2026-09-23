import { IBrandImpl } from "@/app/dto/interface/brand-interface";
import { BrandEntity } from "@/domain/entities/brand-entity";
import { AppError } from "@/shared/api/api-error";
import {
  TCreateBrandEX,
  TUpdateBrandEX,
  TUpdateBrandStatusEX,
} from "@/presentation/validator/brand-zod";
import { PaginatedResult, QueryResult } from "@/types";

export abstract class UseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;
}

// ============================================================
// CreateBrandUC
// ============================================================
export class CreateBrandUC extends UseCase<TCreateBrandEX, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(input: TCreateBrandEX): Promise<BrandEntity> {
    const existing = await this.repo.findByName(input.name);
    if (existing) {
      throw new AppError(
        `Brand with name "${input.name}" already exists`,
        409,
        "CONFLICT",
      );
    }
    const entity = await this.repo.create(input);
    return entity;
  }
}

// ============================================================
// GetBrandByIdUC
// ============================================================
export class GetBrandByIdUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new AppError("Brand not found", 404, "NOT_FOUND");
    }
    return entity;
  }
}

// ============================================================
// UpdateBrandUC
// ============================================================
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
      throw new AppError("Brand not found", 404, "NOT_FOUND");
    }
    if (input.data.name !== undefined) {
      const dup = await this.repo.findByName(input.data.name);
      if (dup && dup.id !== input.id) {
        throw new AppError(
          `Brand with name "${input.data.name}" already exists`,
          409,
          "CONFLICT",
        );
      }
    }
    const updated = await this.repo.update(input.id, input.data);
    if (!updated) {
      throw new AppError("Brand update failed", 400, "BAD_REQUEST");
    }
    return updated;
  }
}

// ============================================================
// DeleteBrandUC
// ============================================================
export class DeleteBrandUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const entity = await this.repo.delete(id);
    if (!entity) {
      throw new AppError("Brand not found", 404, "NOT_FOUND");
    }
    return entity;
  }
}

// ============================================================
// ArchiveBrandUC
// ============================================================
export class ArchiveBrandUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const entity = await this.repo.archive(id);
    if (!entity) {
      throw new AppError("Brand not found", 404, "NOT_FOUND");
    }
    return entity;
  }
}

// ============================================================
// RestoreBrandUC
// ============================================================
export class RestoreBrandUC extends UseCase<string, BrandEntity> {
  constructor(private readonly repo: IBrandImpl) {
    super();
  }

  async execute(id: string): Promise<BrandEntity> {
    const entity = await this.repo.restore(id);
    if (!entity) {
      throw new AppError("Brand not found", 404, "NOT_FOUND");
    }
    return entity;
  }
}

// ============================================================
// UpdateBrandStatusUC
// ============================================================
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
      throw new AppError("Brand not found", 404, "NOT_FOUND");
    }
    const updated = await this.repo.update(input.id, input.data);
    if (!updated) {
      throw new AppError("Brand status update failed", 400, "BAD_REQUEST");
    }
    return updated;
  }
}

// ============================================================
// ListBrandsUC
// ============================================================
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
