import { SubCategoryRepoType } from "@/domain/interface/subcategory.interface";
import { AppError } from "@/shared/utils/api.error";
import { UpdateSubCategoryDTO } from "@/application/dtos/subcategory.dto";

export class UpdateSubCategory {
  constructor(private subCategoryRepo: SubCategoryRepoType) {}

  async execute(id: string, data: UpdateSubCategoryDTO) {
    const subCategory = await this.subCategoryRepo.findById(id);
    if (!subCategory) AppError.notFound("sub category not found");

    if (data.name) {
      const existing = await this.subCategoryRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        AppError.conflict("sub category name already exists");
      }
    }

    const updated = await this.subCategoryRepo.update(id, data);
    return updated;
  }
}
