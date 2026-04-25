import { AbstractRepo } from "@/repo/base.repo";
import { IBrand, BrandStatusEnum } from "@/types/brand.dto";
import { brandModel } from "@/models/brand.model";
export class BrandRepo extends AbstractRepo<IBrand> {
  constructor() {
    super(brandModel);
  }

  // Use the inherited methods: create, findById, updateById, findAllWithFeatures
  async findAllWithFeatures(query: any) {
    return super.findAllWithFeatures(query, ["name", "slug"]);
  }

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
