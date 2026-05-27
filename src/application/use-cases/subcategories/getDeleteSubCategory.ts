import { SubCategoryRepoType } from "@/domain/types/subcategory.types";

export class GetDeletedSubCategories {
  constructor(private subCategoryRepo: SubCategoryRepoType) {}

  async execute() {
    return await this.subCategoryRepo.findDeleted();
  }
}
