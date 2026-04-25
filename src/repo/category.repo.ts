import { AbstractRepo } from "@/repo/base.repo";
import { ICategory, CategoryStatusEnum } from "@/types/category.dto";
import { categoryModel } from "@/models/category.model";
export class CategoryRepo extends AbstractRepo<ICategory> {
  constructor() {
    super(categoryModel);
  }

  // Use the inherited methods: create, findById, updateById, findAllWithFeatures

  async softDelete(id: string): Promise<ICategory | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: CategoryStatusEnum.ARCHIVED },
        { new: true },
      )
      .setOptions({ withDeleted: true });
  }

  async restore(id: string): Promise<ICategory | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: CategoryStatusEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
  }

  async findDeleted(): Promise<ICategory[]> {
    return this.model
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true });
  }
}

export const categoryRepo = new CategoryRepo();
