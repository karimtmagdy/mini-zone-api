import { BrandRepoType } from "@/domain/interface/brand.interface";
import { AppError } from "@/shared/utils/api.error";

export class SoftDeleteBrand {
  constructor(private brandRepo: BrandRepoType) {}

  async execute(id: string) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) AppError.notFound("brand not found");

    return await this.brandRepo.softDelete(id);
  }
}
