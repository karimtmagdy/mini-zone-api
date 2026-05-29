import { PaginatedResult } from "@/types/global.dto";
import { CategoryRepoType } from "@/domain/types/category.types";
import { Category } from "@/domain/entities/Category";

export class GetAllCategories {
  constructor(private catRepo: CategoryRepoType) {}

  async execute(query: any): Promise<PaginatedResult<Category>> {
    return await this.catRepo.findAll(query);
  }
}
