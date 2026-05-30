// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { SubCategoryRepoType } from "@/domain/types/subcategory.types";
import { AppError } from "@/shared/utils/api.error";
export class SoftDeleteSubCategory {
  constructor(
    private subCategoryRepo: SubCategoryRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer: IUser) {
    const subCategory = await this.subCategoryRepo.findById(id);
    if (!subCategory) throw AppError.notFound("subcategory not found");

    const result = await this.subCategoryRepo.softDelete(id, performer.id);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Subcategory archived",
    //  target: `Subcategory: ${subCategory.name}`,
    //  details: { subCategoryId: id },
    //  timestamp: new Date(),
    // });

    return result;
  }
}
