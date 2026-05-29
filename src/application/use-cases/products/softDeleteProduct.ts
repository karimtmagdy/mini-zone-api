// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { ProductRepoType } from "@/domain/types/product.types";
import { AppError } from "@/shared/utils/api.error";
export class SoftDeleteProduct {
  constructor(
    private productRepo: ProductRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer: IUser) {
    const product = await this.productRepo.findById(id);
    if (!product) throw AppError.notFound("product not found");

    const result = await this.productRepo.softDelete(id, performer.id);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Product archived",
    //  target: `Product: ${product.name}`,
    //  details: { productId: id },
    //  timestamp: new Date(),
    // });

    return result;
  }
}
