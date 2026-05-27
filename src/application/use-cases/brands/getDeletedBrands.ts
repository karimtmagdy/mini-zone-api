import { BrandRepoType } from "@/domain/types/brand.types";

export class GetDeletedBrands {
  constructor(private brandRepo: BrandRepoType) {}

  async execute() {
    return await this.brandRepo.findDeleted();
  }
}
