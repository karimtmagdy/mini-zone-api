import { ProductRepoType } from "@/domain/types/product.types";
import { Product } from "@/domain/entities/Product";

export class GetTopTenProducts {
  constructor(private productRepo: ProductRepoType) {}

  async execute(): Promise<Product[]> {
    return await this.productRepo.findTopTen();
  }
}
