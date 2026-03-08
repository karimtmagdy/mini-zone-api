import { AbstractRepo } from "./base.repo.js";
import { ICategory } from "../unity/interface/category.interface.js";
import { categoryModel } from "../models/category.model.js";
import { CategoryStatusEnum } from "../unity/enums/category.enums.js";
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
