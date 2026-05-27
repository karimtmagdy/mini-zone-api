import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { SubCategoryRepoType } from "@/domain/types/subcategory.types";
import { AppError } from "@/shared/utils/api.error";
export class RestoreSubCategory {
  constructor(
    private subCategoryRepo: SubCategoryRepoType,
    private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer: IUser) {
    const subCategory = await this.subCategoryRepo.restore(id, performer.id);
    if (!subCategory) throw AppError.notFound("subcategory not found in trash");

    await this.recordActivity.execute({
      user: {
        username: performer.username,
        email: performer.email,
        role: performer.role!,
      },
      action: "Subcategory restored",
      target: `Subcategory: ${subCategory.name}`,
      details: { subCategoryId: id },
      timestamp: new Date(),
    });

    return subCategory;
  }
}
