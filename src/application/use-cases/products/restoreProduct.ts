import { ProductRepoType } from "@/domain/interface/product.interface";
import { AppError } from "@/shared/utils/api.error";

export class RestoreProduct {
  constructor(private productRepo: ProductRepoType) {}

  async execute(id: string) {
    const product = await this.productRepo.restore(id);
    if (!product) AppError.notFound("product not found in trash");
    return product;
  }
}
