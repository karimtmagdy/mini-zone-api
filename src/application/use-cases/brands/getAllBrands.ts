import { BrandRepoType } from "@/domain/types/brand.types";
import { Brand } from "@/domain/entities/Brand";
import { PaginatedResult } from "@/types/global.dto";

export class GetAllBrands {
  constructor(private brandRepo: BrandRepoType) {}
  async execute(query: any): Promise<PaginatedResult<Brand>> {
    return await this.brandRepo.findAll(query);
  }
}
