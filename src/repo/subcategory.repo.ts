import { SubCategoryEnum, ISubCategory } from "@/types/subcategory.dto";
import { SubCategory } from "@/models/subcategory.model";
import { AbstractRepo } from "./base.repo";
import { APIFeatures } from "@/class/api.feature";

export class SubCategoryRepo extends AbstractRepo<ISubCategory> {
  constructor() {
    super(SubCategory);
  }
  
  async findById(id: string): Promise<ISubCategory | null> {
    return this.model.findById(id).populate({ path: "category", select: "name" }).exec();
  }

  async updateById(id: string, update: any): Promise<ISubCategory | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .populate({ path: "category", select: "name" })
      .exec();
  }

  async findAllWithFeatures(queryString: any) {
    const features = new APIFeatures<ISubCategory>(this.model, queryString)
      .filter()
      .search(["name", "slug"])
      .sort()
      .limitFields()
      .paginate()
      .populate({ path: "category", select: "name" });
    return features.execute();
  }

  async softDelete(id: string): Promise<ISubCategory | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: SubCategoryEnum.TRASH },
        { new: true, runValidators: true },
      )
      .setOptions({ withDeleted: true }).exec();
  }

  async restore(id: string): Promise<ISubCategory | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: SubCategoryEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true }).exec();
  }

  async findDeleted(): Promise<ISubCategory[]> {
    return this.model.find({ deletedAt: { $ne: null } })
    .setOptions({ withDeleted: true }).exec();
  }
}

export const subcategoryRepo = new SubCategoryRepo();
