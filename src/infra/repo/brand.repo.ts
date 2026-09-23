import { IBrandImpl } from "@/domain/ports/brand.repo.port";
import { BrandDoc } from "@/app/dto/brand.dto";
import { BrandMapper } from "@/app/mapping/brand.mapper";
import { BrandEntity } from "@/domain/entities/brand.entity";
import { brandDB } from "@/infra/db/brand.db";
import {
  TCreateBrandEX,
  TUpdateBrandEX,
} from "@/presentation/validator/brand.zod";
import { PaginatedResult, QueryResult } from "@/types";
import { Model, SortOrder } from "mongoose";

export class BrandImpl implements IBrandImpl {
  constructor(private readonly db: Model<BrandDoc>) {}

  async create(item: TCreateBrandEX): Promise<BrandEntity> {
    const doc = await this.db.create(item);
    return BrandMapper.toDomain(doc.toObject());
  }

  async findById(id: string): Promise<BrandEntity | null> {
    const doc = await this.db.findById(id);
    if (!doc) return null;
    return BrandMapper.toDomain(doc.toObject());
  }

  async findByName(name: string): Promise<BrandEntity | null> {
    const doc = await this.db.findOne({ name });
    if (!doc) return null;
    return BrandMapper.toDomain(doc.toObject());
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.db.countDocuments({ _id: id });
    return count > 0;
  }

  async counter(id: string): Promise<boolean> {
    const result = await this.db.updateOne(
      { _id: id },
      { $inc: { products: 1 } },
    );
    return result.modifiedCount > 0;
  }

  async update(id: string, item: TUpdateBrandEX): Promise<BrandEntity | null> {
    const doc = await this.db.findByIdAndUpdate(id, item, { new: true });
    if (!doc) return null;
    return BrandMapper.toDomain(doc.toObject());
  }

  async archive(id: string): Promise<BrandEntity | null> {
    const doc = await this.db.findById(id);
    if (!doc) return null;
    const entity = BrandMapper.toDomain(doc.toObject());
    entity.archive();
    const updated = await this.db.findByIdAndUpdate(
      id,
      BrandMapper.toPersistence(entity),
      { new: true },
    );
    if (!updated) return null;
    return BrandMapper.toDomain(updated.toObject());
  }

  async restore(id: string): Promise<BrandEntity | null> {
    const doc = await this.db.findById(id);
    if (!doc) return null;
    const entity = BrandMapper.toDomain(doc.toObject());
    entity.unarchive();
    const updated = await this.db.findByIdAndUpdate(
      id,
      BrandMapper.toPersistence(entity),
      { new: true },
    );
    if (!updated) return null;
    return BrandMapper.toDomain(updated.toObject());
  }

  async delete(id: string): Promise<BrandEntity | null> {
    const doc = await this.db.findByIdAndDelete(id);
    if (!doc) return null;
    return BrandMapper.toDomain(doc.toObject());
  }

  async list(
    query: Partial<QueryResult>,
  ): Promise<PaginatedResult<BrandEntity>> {
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.max(1, Number(query.limit ?? 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { slug: { $regex: query.search, $options: "i" } },
      ];
    }

    const sort: Record<string, SortOrder> = {};
    if (query.sort) {
      const sortFields = query.sort.split(",");
      for (const field of sortFields) {
        const [k, ...rest] = field.split(":");
        const order = rest[0] === "desc" ? -1 : 1;
        if (k) sort[k] = order;
      }
    }
    if (Object.keys(sort).length === 0) {
      sort.createdAt = -1;
    }

    const projection = query.fields
      ? query.fields.split(",").filter(Boolean).join(" ")
      : undefined;

    const [total, docs] = await Promise.all([
      this.db.countDocuments(filter),
      this.db
        .find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    const pages = Math.ceil(total / limit);
    const data = docs.map((d) => BrandMapper.toDomain(d));

    return {
      data,
      meta: {
        total,
        limit,
        pages,
        page,
      },
    };
  }
}

export const brandRepo = new BrandImpl(brandDB);
