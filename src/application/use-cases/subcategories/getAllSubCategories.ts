import { PaginatedResult } from "@/_R/global.dto";
import { SubCategoryRepoType } from "@/domain/types/subcategory.types";
import { SubCategory } from "@/domain/entities/SubCategory";

export class GetAllSubCategories {
  constructor(private subCategoryRepo: SubCategoryRepoType) {}

  async execute(query: any): Promise<PaginatedResult<SubCategory>> {
    return await this.subCategoryRepo.findAll(query);
  }
}
