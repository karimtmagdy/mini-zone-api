import { ProductRepoType } from "@/domain/interface/product.interface";
import { Product } from "@/domain/entities/Product";

export class GetProductsByCategory {
  constructor(private productRepo: ProductRepoType) {}

  async execute(categoryId: string): Promise<Product[]> {
    return await this.productRepo.findByCategory(categoryId);
  }
}
