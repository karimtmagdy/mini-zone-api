// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { ProductRepoType } from "@/domain/types/product.types";
import { Product } from "@/domain/entities/Product";

export class UpdateProductStock {
  constructor(
    private productRepo: ProductRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(
    id: string,
    stock: number,
    performer: IUser,
  ): Promise<Product | null> {
    const updated = await this.productRepo.updateStock(id, stock, performer.id);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Product stock updated",
    //  target: `Product: ${updated?.name || id}`,
    //  details: { productId: id, newStock: stock },
    //  timestamp: new Date(),
    // });

    return updated;
  }
}
