import { ProductRepoType } from "@/domain/interface/product.interface";
import { Product } from "@/domain/entities/Product";

export class UpdateProductStock {
  constructor(private productRepo: ProductRepoType) {}

  async execute(id: string, stock: number): Promise<Product | null> {
    return await this.productRepo.updateStock(id, stock);
  }
}
