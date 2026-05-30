// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { SubCategoryRepoType } from "@/domain/types/subcategory.types";
import { AppError } from "@/shared/utils/api.error";
import { SubCategory } from "@/domain/entities/SubCategory";
import { CreateSubCategoryDTO } from "@/presentation/validation/subcategory.zod";
export class CreateSubCategory {
  constructor(
    private subCategoryRepo: SubCategoryRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(
    data: CreateSubCategoryDTO,
    performer: IUser,
  ): Promise<SubCategory> {
    const isExist = await this.subCategoryRepo.findByName(data.name);
    if (isExist) {
      throw AppError.conflict("subcategory name already exists");
    }

    const subCategory = new SubCategory(data);
    const createdSubCategory = await this.subCategoryRepo.create(
      subCategory,
      performer.id,
    );

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Subcategory created",
    //  target: `Subcategory: ${createdSubCategory.name}`,
    //  details: { subCategoryId: createdSubCategory.id },
    //  timestamp: new Date(),
    // });

    return createdSubCategory;
  }
}
