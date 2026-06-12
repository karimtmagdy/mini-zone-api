// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { SubCategoryRepoType } from "@/domain/types/subcategory.types";
import { SubCategory } from "@/domain/entities/SubCategory";
import { AppError } from "@/shared/utils/api.error";
import { UpdateSubCategoryDTO } from "@/presentation/validation/subcategory.zod";
export class UpdateSubCategory {
  constructor(
    private subCategoryRepo: SubCategoryRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, data: UpdateSubCategoryDTO, performer: IUser) {
    const subCategory = await this.subCategoryRepo.findById(id);
    if (!subCategory) throw AppError.notFound("subcategory not found");

    if (data.name) {
      const existing = await this.subCategoryRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict("subcategory name already exists");
      }
    }

    const { category: categoryIds, ...rest } = data;
    const payload: Partial<SubCategory> = {
      ...rest,
      ...(categoryIds && {
        category: categoryIds.map((id) => ({ id, name: "" })),
      }),
    };

    const updated = await this.subCategoryRepo.update(id, payload, performer.id);
    // const updated = await this.subCategoryRepo.update(id, data, performer.id);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Subcategory updated",
    //  target: `Subcategory: ${updated?.name || id}`,
    //  details: { subCategoryId: id, updates: data },
    //  timestamp: new Date(),
    // });

    return updated;
  }
}
