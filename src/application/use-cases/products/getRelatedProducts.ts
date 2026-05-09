import { ProductRepoType } from "@/domain/interface/product.interface";
import { Product } from "@/domain/entities/Product";

export class GetRelatedProducts {
  constructor(private productRepo: ProductRepoType) {}

  async execute(id: string): Promise<Product[]> {
    return await this.productRepo.findRelated(id);
  }
}
