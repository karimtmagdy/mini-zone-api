import { Model, QueryFilter, UpdateQuery } from "mongoose";
import { APIFeatures } from "@/shared/utils/api.feature";
import {
  APIFeaturesResultDto,
  QueryStringDto,
} from "@/shared/schema/query.schema";

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

  async softDelete(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .setOptions({ withDeleted: true })
      .exec();
  }

  async restore(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { deletedAt: null }, { new: true })
      .setOptions({ withDeleted: true })
      .exec();
  }

  async findDeleted(
    queryString: QueryStringDto,
  ): Promise<APIFeaturesResultDto<T>> {
    const features = new APIFeatures<T>(this.model, queryString)
      .filter()
      .sort()
      .paginate();

    // Explicitly filter for deleted items and bypass the global find filter
    features["query"] = features["query"]
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true });

    return features.execute();
  }

  async updateMany(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
  ): Promise<number> {
    const result = await this.model.updateMany(filter, update).exec();
    return result.modifiedCount;
  }
}
