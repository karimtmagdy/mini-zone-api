import { SubCategoryRepoType } from "@/domain/interface/subcategory.interface";

export class GetDeletedSubCategories {
  constructor(private subCategoryRepo: SubCategoryRepoType) {}

  async execute() {
    return await this.subCategoryRepo.findDeleted();
  }
}
