import { ProductRepoType } from "@/domain/types/product.types";
import { Product } from "@/domain/entities/Product";

export class GetProductsByBrand {
  constructor(private productRepo: ProductRepoType) {}

  async execute(brandId: string): Promise<Product[]> {
    return await this.productRepo.findByBrand(brandId);
  }
}
