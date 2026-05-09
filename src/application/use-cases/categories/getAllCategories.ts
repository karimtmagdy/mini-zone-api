import { PaginatedResult } from "@/_R/types/global.dto";
import { CategoryRepoType } from "@/domain/interface/category.interface";
import { Category } from "@/domain/entities/Category";

export class GetAllCategories {
  constructor(private catRepo: CategoryRepoType) {}

  async execute(query: any): Promise<PaginatedResult<Category>> {
    return await this.catRepo.findAll(query);
  }
}
