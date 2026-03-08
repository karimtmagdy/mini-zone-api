import { AbstractRepo } from "../repo/base.repo.js";
import { AppError } from "../class/api.error.js";

export abstract class AbstractService<T> {
  constructor(protected readonly repo: AbstractRepo<T>) {}

  async exists(filter: any): Promise<boolean> {
    return this.repo.exists(filter);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repo.create(data);
  }

  async getAll(query: any): Promise<any> {
    // Assuming we use findAllWithFeatures for generic search/sort/page
    return this.repo.findAllWithFeatures(query);
  }

  async getById(id: string): Promise<T> {
    const doc = await this.repo.findById(id);
    if (!doc) {
      throw AppError.notFound("Document not found");
    }
    return doc;
  }

  async update(id: string, data: any): Promise<T> {
    const doc = await this.repo.updateById(id, data);
    if (!doc) {
      throw AppError.notFound("Document not found");
    }
    return doc;
  }

  async delete(id: string): Promise<void> {
    const success = await this.repo.deleteById(id);
    if (!success) {
      throw AppError.notFound("Document not found");
    }
  }
}
