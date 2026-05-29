// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { CategoryRepoType } from "@/domain/types/category.types";
import { AppError } from "@/shared/utils/api.error";
export class SoftDeleteCategory {
  constructor(
    private categoryRepo: CategoryRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer: IUser) {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw AppError.notFound("category not found");

    const result = await this.categoryRepo.softDelete(id, performer.id);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Category archived",
    //  target: `Category: ${category.name}`,
    //  details: { categoryId: id },
    //  timestamp: new Date(),
    // });

    return result;
  }
}
