import { PaginatedResult } from "@/_R/types/global.dto";
import { ProductRepoType } from "@/domain/interface/product.interface";
import { Product } from "@/domain/entities/Product";

export class GetAllProducts {
  constructor(private productRepo: ProductRepoType) {}

  async execute(query: any): Promise<PaginatedResult<Product>> {
    return await this.productRepo.findAll(query);
  }
}
