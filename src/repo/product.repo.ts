import { AbstractRepo } from "@/repo/base.repo";
import { IProduct, ProductStatusEnum } from "@/types/product.dto";
import { productModel } from "@/models/product.model";
import { APIFeaturesResultDto, QueryStringDto } from "@/validation/rules/query.schema";
import { APIFeatures } from "@/class/api.feature";

export class ProductRepo extends AbstractRepo<IProduct> {
  constructor() {
    super(productModel);
  }

  async findAllWithFeatures(
    queryString: QueryStringDto,
    searchFields: string[] = ["name"],
  ): Promise<APIFeaturesResultDto<IProduct>> {
    const features = new APIFeatures<IProduct>(this.model, queryString)
      .filter()
      .search(searchFields)
      .sort()
      .limitFields()
      .paginate()
      .populate(["category", "brand"]);
    return features.execute();
  }

  async softDelete(id: string): Promise<IProduct | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: ProductStatusEnum.TRASH },
        { new: true },
      )
      .setOptions({ withDeleted: true });
  }

  async restore(id: string): Promise<IProduct | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: ProductStatusEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
  }

  async findDeleted(): Promise<IProduct[]> {
    return this.model
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true })
      .populate(["category", "brand"]);
  }
}

export const productRepo = new ProductRepo();
