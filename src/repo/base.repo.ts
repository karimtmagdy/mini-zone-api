import { Document, Model, QueryFilter, UpdateQuery } from "mongoose";

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * AbstractRepository — generic CRUD base for all Mongoose repositories.
 */
export abstract class AbstractRepo<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(
    filter: QueryFilter<T> = {},
    options: PaginationOptions = { page: 1, limit: 10 },
  ): Promise<PaginatedResult<T>> {
    const skip = (options.page - 1) * options.limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(options.limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return {
      data,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async create(payload: Partial<T>): Promise<T> {
    return this.model.create(payload);
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .exec();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async exists(filter: QueryFilter<T>): Promise<boolean> {
    return (await this.model.exists(filter)) !== null;
  }
}
