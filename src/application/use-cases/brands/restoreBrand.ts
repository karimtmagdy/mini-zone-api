import { BrandRepoType } from "@/domain/interface/brand.interface";
import { AppError } from "@/shared/utils/api.error";

export class RestoreBrand {
  constructor(private brandRepo: BrandRepoType) {}

  async execute(id: string) {
    const brand = await this.brandRepo.restore(id);
    if (!brand) AppError.notFound("brand not found in trash");
    return brand;
  }
}
