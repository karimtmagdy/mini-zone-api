import { CategoryRepoType } from "@/domain/interface/category.interface";
import { AppError } from "@/shared/utils/api.error";

export class GetCategoryById {
  constructor(private categoryRepo: CategoryRepoType) {}

  async execute(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) AppError.notFound("category not found");
    return category;
  }
}
