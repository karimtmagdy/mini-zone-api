import { BrandRepoType } from "@/domain/types/brand.types";
import { AppError } from "@/shared/utils/api.error";

export class GetBrandById {
  constructor(private brandRepo: BrandRepoType) {}

  async execute(id: string) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) AppError.notFound("brand not found");
    return brand;
  }
}
