import { ProductRepoType } from "@/domain/interface/product.interface";
import { Product } from "@/domain/entities/Product";

export class GetOutOfStockProducts {
  constructor(private productRepo: ProductRepoType) {}

  async execute(): Promise<Product[]> {
    return await this.productRepo.findOutOfStock();
  }
}
