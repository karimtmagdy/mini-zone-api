import { ProductRepoType } from "@/domain/types/product.types";

export class GetDeletedProducts {
  constructor(private productRepo: ProductRepoType) {}

  async execute() {
    return await this.productRepo.findDeleted();
  }
}
