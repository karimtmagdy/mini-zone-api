import { BrandRepoType } from "@/domain/interface/brand.interface";

export class GetDeletedBrands {
  constructor(private brandRepo: BrandRepoType) {}

  async execute() {
    return await this.brandRepo.findDeleted();
  }
}
