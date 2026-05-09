import { ProductRepoType } from "@/domain/interface/product.interface";
import { Product } from "@/domain/entities/Product";

export class GetProductsByBrand {
  constructor(private productRepo: ProductRepoType) {}

  async execute(brandId: string): Promise<Product[]> {
    return await this.productRepo.findByBrand(brandId);
  }
}
