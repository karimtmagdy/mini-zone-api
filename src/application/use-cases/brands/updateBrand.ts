import { BrandRepoType } from "@/domain/interface/brand.interface";
import { AppError } from "@/shared/utils/api.error";
// import { Brand } from "@/domain/entities/Brand";
import { UpdateBrandDTO } from "@/application/dtos/brand.dto";

export class UpdateBrand {
  constructor(private brandRepo: BrandRepoType) {}

  async execute(id: string, data: UpdateBrandDTO) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) AppError.notFound("brand not found");

    if (data.name) {
      const existing = await this.brandRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        AppError.conflict("brand name already exists");
      }
    }

    const updated = await this.brandRepo.update(id, data);
    return updated;
  }
}
