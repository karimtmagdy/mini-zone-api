// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { CategoryRepoType } from "@/domain/types/category.types";
import { AppError } from "@/shared/utils/api.error";
export class RestoreCategory {
  constructor(
    private categoryRepo: CategoryRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer: IUser) {
    const category = await this.categoryRepo.restore(id, performer.id);
    if (!category) throw AppError.notFound("category not found in trash");

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Category restored",
    //  target: `Category: ${category.name}`,
    //  details: { categoryId: id },
    //  timestamp: new Date(),
    // });

    return category;
  }
}
