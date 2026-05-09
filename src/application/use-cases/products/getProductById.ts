import { ProductRepoType } from "@/domain/interface/product.interface";
import { AppError } from "@/shared/utils/api.error";

export class GetProductById {
  constructor(private productRepo: ProductRepoType) {}

  async execute(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) AppError.notFound("product not found");
    return product;
  }
}
