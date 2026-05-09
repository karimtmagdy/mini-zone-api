import { CategoryRepoType } from "@/domain/interface/category.interface";
import { AppError } from "@/shared/utils/api.error";
import { UpdateCategoryDTO } from "@/application/dtos/category.dto";

export class UpdateCategory {
  constructor(private categoryRepo: CategoryRepoType) {}

  async execute(id: string, data: UpdateCategoryDTO) {
    const category = await this.categoryRepo.findById(id);
    if (!category) AppError.notFound("category not found");

    if (data.name) {
      const existing = await this.categoryRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        AppError.conflict("category name already exists");
      }
    }

    const updated = await this.categoryRepo.update(id, data);
    return updated;
  }
}
