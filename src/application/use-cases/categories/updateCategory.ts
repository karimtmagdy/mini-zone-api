import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { CategoryRepoType } from "@/domain/types/category.types";
import { AppError } from "@/shared/utils/api.error";
import { UpdateCategoryDTO } from "@/presentation/validation/category.zod";
export class UpdateCategory {
  constructor(
    private categoryRepo: CategoryRepoType,
    private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, data: UpdateCategoryDTO, performer: IUser) {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw AppError.notFound("category not found");

    if (data.name) {
      const existing = await this.categoryRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict("category name already exists");
      }
    }

    const updated = await this.categoryRepo.update(id, data, performer.id);

    await this.recordActivity.execute({
      user: {
        username: performer.username,
        email: performer.email,
        role: performer.role!,
      },
      action: "Category updated",
      target: `Category: ${updated?.name || id}`,
      details: { categoryId: id, updates: data },
      timestamp: new Date(),
    });

    return updated;
  }
}
