import { AbstractRepo } from "./base.repo.js";
import { IBrand } from "../unity/interface/brand.interface.js";
import { brandModel } from "../models/brand.model.js";
import { BrandStatusEnum } from "../unity/enums/brand.enums.js";
export class BrandRepo extends AbstractRepo<IBrand> {
  constructor() {
    super(brandModel);
  }

  // Use the inherited methods: create, findById, updateById, findAllWithFeatures

  async softDelete(id: string): Promise<IBrand | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: BrandStatusEnum.ARCHIVED },
        { new: true },
      )
      .setOptions({ withDeleted: true });
  }

  async restore(id: string): Promise<IBrand | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: BrandStatusEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
  }

  async findDeleted(): Promise<IBrand[]> {
    return this.model
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true });
  }
}

export const brandRepo = new BrandRepo();
