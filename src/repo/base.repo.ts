import { Document, Model, QueryFilter, UpdateQuery } from "mongoose";
import { APIFeatures } from "../class/api.feature.js";
import {
  APIFeaturesResultDto,
  QueryStringDto,
} from "../unity/core/query.dto.js";

/**
 * AbstractRepository — generic CRUD base for all Mongoose repositories.
 */
export abstract class AbstractRepo<T> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAllWithFeatures(
    queryString: QueryStringDto,
    searchFields: string[] = [],
  ): Promise<APIFeaturesResultDto<T>> {
    const features = new APIFeatures<T>(this.model, queryString)
      .filter()
      .search(searchFields)
      .sort()
      .limitFields()
      .paginate();
    return features.execute();
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

  async deleteMany(filter: QueryFilter<T>): Promise<boolean> {
    const result = await this.model.deleteMany(filter).exec();
    return result.deletedCount > 0;
  }

  async updateMany(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
  ): Promise<number> {
    const result = await this.model.updateMany(filter, update).exec();
    return result.modifiedCount;
  }
}
