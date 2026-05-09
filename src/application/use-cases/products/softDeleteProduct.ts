import { ProductRepoType } from "@/domain/interface/product.interface";
import { AppError } from "@/shared/utils/api.error";

export class SoftDeleteProduct {
  constructor(private productRepo: ProductRepoType) {}

  async execute(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) AppError.notFound("product not found");

    return await this.productRepo.softDelete(id);
  }
}
