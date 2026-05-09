import { PaginatedResult } from "@/_R/types/global.dto";
import { SubCategoryRepoType } from "@/domain/interface/subcategory.interface";
import { SubCategory } from "@/domain/entities/SubCategory";

export class GetAllSubCategories {
  constructor(private subCategoryRepo: SubCategoryRepoType) {}

  async execute(query: any): Promise<PaginatedResult<SubCategory>> {
    return await this.subCategoryRepo.findAll(query);
  }
}
