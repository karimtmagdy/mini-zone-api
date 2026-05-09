import { ProductRepoType } from "@/domain/interface/product.interface";

export class GetDeletedProducts {
  constructor(private productRepo: ProductRepoType) {}

  async execute() {
    return await this.productRepo.findDeleted();
  }
}
