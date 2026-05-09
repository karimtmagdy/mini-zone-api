import { SubCategoryRepoType } from "@/domain/interface/subcategory.interface";
import { AppError } from "@/shared/utils/api.error";

export class GetSubCategoryById {
  constructor(private subCategoryRepo: SubCategoryRepoType) {}

  async execute(id: string) {
    const subCategory = await this.subCategoryRepo.findById(id);
    if (!subCategory) AppError.notFound("sub category not found");
    return subCategory;
  }
}
