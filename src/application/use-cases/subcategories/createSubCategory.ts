import { SubCategoryRepoType } from "@/domain/interface/subcategory.interface";
import { AppError } from "@/shared/utils/api.error";
import { SubCategory } from "@/domain/entities/SubCategory";
import { CreateSubCategoryDTO } from "@/application/dtos/subcategory.dto";

export class CreateSubCategory {
  constructor(private subCategoryRepo: SubCategoryRepoType) {}

  async execute(data: CreateSubCategoryDTO): Promise<SubCategory> {
    const isExist = await this.subCategoryRepo.findByName(data.name);
    if (isExist) {
      AppError.conflict("category name already exists");
    }

    const subCategory = new SubCategory(data);
    return await this.subCategoryRepo.create(subCategory);
  }
}
