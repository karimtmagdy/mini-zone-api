import { CategoryDoc } from "@/app/dto/category.dto";
import { Model, SortOrder } from "mongoose";
import { categoryDB } from "@/infra/db/category.db";
import { ICategoryImpl } from "@/domain/ports/category.repo.port";
import { CategoryEntity } from "@/domain/entities/category.entity";
import { PaginatedResult, QueryResult } from "@/types";
import {
  TCreateCategoryEX,
  TUpdateCategoryEX,
} from "@/presentation/validator/category.zod";
import { CategoryMapper } from "@/app/mapping/category.mapper";

export class CategoryImpl implements ICategoryImpl {
  constructor(private readonly db: Model<CategoryDoc>) {}
  async create(item: TCreateCategoryEX): Promise<CategoryEntity> {
    const doc = await this.db.create(item);
    return CategoryMapper.toDomain(doc.toObject<CategoryDoc>());
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const doc = await this.db
      .findOne({ _id: id, isArchived: false, archivedAt: { $ne: null } })
      .populate("products")
      .lean<CategoryDoc>();
    if (!doc) return null;
    return CategoryMapper.toDomain(doc);
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const doc = await this.db.findOne({ name }).lean<CategoryDoc>();
    if (!doc) return null;
    return CategoryMapper.toDomain(doc);
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.db.exists({
      _id: id,
      isArchived: false,
      archivedAt: null,
    });
    return result !== null;
  }

  // leave it right now as a comment
  // async counter(id: string): Promise<boolean> {
  //   const result = await this.db.updateOne(
  //     { _id: id },
  //     { $inc: { products: 1 } },
  //   );
  //   return result.modifiedCount > 0;
  // }
  // async counter(id: string): Promise<boolean> {
  //   const count = await this.db.countDocuments({ _id: id });
  //   return count > 0;
  // }

  async update(
    id: string,
    item: TUpdateCategoryEX,
  ): Promise<CategoryEntity | null> {
    const doc = await this.db
      .findByIdAndUpdate(id, item, { new: true })
      .lean<CategoryDoc>();
    if (!doc) return null;
    return CategoryMapper.toDomain(doc);
  }

  async archive(id: string): Promise<CategoryEntity | null> {
    const doc = await this.db
      .findOne({ _id: id, isArchived: false, archivedAt: { $eq: null } })
      .lean<CategoryDoc>();
    if (!doc) return null;
    const entity = CategoryMapper.toDomain(doc);
    entity.archive();
    const updated = await this.db
      .findByIdAndUpdate(id, CategoryMapper.toPersistence(entity), {
        new: true,
      })
      .lean<CategoryDoc>();
    if (!updated) return null;
    return CategoryMapper.toDomain(updated);
  }

  async restore(id: string): Promise<CategoryEntity | null> {
    const doc = await this.db
      .findOne({ _id: id, isArchived: true, archivedAt: { $ne: null } })
      .lean<CategoryDoc>();
    if (!doc) return null;
    const entity = CategoryMapper.toDomain(doc);
    entity.unarchive();
    const updated = await this.db
      .findByIdAndUpdate(id, CategoryMapper.toPersistence(entity), {
        new: true,
      })
      .lean<CategoryDoc>();
    if (!updated) return null;
    return CategoryMapper.toDomain(updated);
  }

  async delete(id: string): Promise<CategoryEntity | null> {
    const doc = await this.db.findByIdAndDelete(id).lean<CategoryDoc>();
    if (!doc) return null;
    return CategoryMapper.toDomain(doc);
  }

  async list(
    query: Partial<QueryResult>,
  ): Promise<PaginatedResult<CategoryEntity>> {
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
    const data = docs.map((d) => CategoryMapper.toDomain(d));

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
export const categoryRepo = new CategoryImpl(categoryDB);
