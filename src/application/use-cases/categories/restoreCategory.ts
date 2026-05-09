import { CategoryRepoType } from "@/domain/interface/category.interface";
import { AppError } from "@/shared/utils/api.error";

export class RestoreCategory {
  constructor(private categoryRepo: CategoryRepoType) {}

  async execute(id: string) {
    const category = await this.categoryRepo.restore(id);
    if (!category) AppError.notFound("category not found in trash");
    return category;
  }
}
