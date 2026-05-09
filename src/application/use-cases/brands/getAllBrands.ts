import { BrandRepoType } from "@/domain/interface/brand.interface";
import { Brand } from "@/domain/entities/Brand";
import { PaginatedResult } from "@/_R/types/global.dto";

export class GetAllBrands {
  constructor(private brandRepo: BrandRepoType) {}

  async execute(query: any): Promise<PaginatedResult<Brand>> {
    return await this.brandRepo.findAll(query);
  }
}
