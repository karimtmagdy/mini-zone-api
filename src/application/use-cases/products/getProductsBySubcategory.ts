import { ProductRepoType } from "@/domain/types/product.types";
import { Product } from "@/domain/entities/Product";

export class GetProductsBySubcategory {
  constructor(private productRepo: ProductRepoType) {}

  async execute(subcategoryId: string): Promise<Product[]> {
    return await this.productRepo.findBySubcategory(subcategoryId);
  }
}
